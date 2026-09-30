"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { CommentIcon, HeartIcon, HeartOutlineIcon } from "@/components/Icons";
import { ReportButton } from "@/components/ReportButton";
import { useAuth } from "@/lib/auth-context";
import { type Pop } from "@/lib/dummy-pops";
import {
  addComment,
  getComments,
  getLikeCount,
  getSocialVersion,
  hasLiked,
  refreshLiked,
  startCommentsListener,
  subscribeSocial,
  toggleLike,
} from "@/lib/social";
import { findPopById } from "@/lib/pops";
import { canEditPop, getPopsVersion, subscribePops } from "@/lib/user-pops";

function formatTime(value: number) {
  return new Date(value).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PopDetail({ popId }: { popId: string }) {
  useSyncExternalStore(subscribeSocial, getSocialVersion, () => 0);
  const popsVersion = useSyncExternalStore(subscribePops, getPopsVersion, () => 0);
  const { profile } = useAuth();
  const router = useRouter();
  const [pop, setPop] = useState<Pop | undefined>(() => findPopById(popId));
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPop(findPopById(popId));
  }, [popId, popsVersion]);

  useEffect(() => {
    const stop = startCommentsListener(popId);
    void refreshLiked(popId, profile?.uid);
    return stop;
  }, [popId, profile?.uid]);

  if (!pop) {
    return (
      <div className="px-4 py-16 text-center text-sm text-zinc-400">
        POPが見つかりません
      </div>
    );
  }

  const comments = getComments(pop.id);
  const liked = hasLiked(pop.id);
  const likes = getLikeCount(pop.id);
  const editable = canEditPop(pop, profile?.uid);

  async function onLike() {
    if (!profile) {
      router.push(`/login?next=/pops/${encodeURIComponent(popId)}`);
      return;
    }
    try {
      await toggleLike(popId);
    } catch {
      setError("いいねを保存できませんでした");
    }
  }

  async function onComment(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    if (!profile) {
      router.push(`/login?next=/pops/${encodeURIComponent(popId)}`);
      return;
    }
    try {
      await addComment(popId, profile.name, draft);
      setDraft("");
      setError("");
    } catch {
      setError("コメントを保存できませんでした");
    }
  }

  return (
    <article className="mx-auto max-w-xl pb-8">
      <div className="aspect-[210/297] bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pop.image}
          alt={pop.title}
          className="size-full object-contain"
        />
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => void onLike()}
            className={`flex items-center gap-1.5 text-sm ${liked ? "text-red-400" : "text-white"}`}
          >
            {liked ? (
              <HeartIcon className="size-6" />
            ) : (
              <HeartOutlineIcon className="size-6" />
            )}
            {likes}
          </button>
          <span className="flex items-center gap-1.5 text-sm text-zinc-300">
            <CommentIcon className="size-6" />
            {comments.length}
          </span>
          <ReportButton popTitle={pop.title} />
        </div>

        <div>
          <h1 className="text-lg font-bold">{pop.title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{pop.date}</p>
          <p className="mt-1">
            <Link
              href={`/users/${encodeURIComponent(pop.author)}`}
              className="text-sm font-medium text-white underline decoration-white/30 underline-offset-4"
            >
              {pop.author}
            </Link>
            {editable && (
              <Link
                href={`/pops/${encodeURIComponent(pop.id)}/edit`}
                className="ml-3 text-xs text-zinc-500"
              >
                投稿内容を修正
              </Link>
            )}
          </p>
        </div>

        {pop.tags.length > 0 ? (
          <p className="text-xs text-zinc-400">
            {pop.tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        ) : null}

        <section>
          <h2 className="mb-2 text-sm font-bold">コメント</h2>
          <ul className="space-y-3">
            {comments.length === 0 ? (
              <li className="text-sm text-zinc-500">まだコメントはありません</li>
            ) : (
              comments.map((comment) => (
                <li key={comment.id} className="text-sm">
                  <Link
                    href={`/users/${encodeURIComponent(comment.author)}`}
                    className="font-medium"
                  >
                    {comment.author}
                  </Link>
                  <span className="ml-2 text-zinc-200">{comment.text}</span>
                  <p className="text-[10px] text-zinc-500">
                    {formatTime(comment.createdAt)}
                  </p>
                </li>
              ))
            )}
          </ul>
          <form onSubmit={(event) => void onComment(event)} className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={profile ? "コメントを書く" : "ログインしてコメント"}
              className="min-w-0 flex-1 rounded-full bg-zinc-900 px-4 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
            >
              送信
            </button>
          </form>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
        </section>
      </div>
    </article>
  );
}
