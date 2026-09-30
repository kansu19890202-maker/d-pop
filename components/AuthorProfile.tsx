"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { CommentIcon, HeartIcon } from "@/components/Icons";
import { EditPopDialog } from "@/components/EditPopDialog";
import { useAuth } from "@/lib/auth-context";
import { type Pop } from "@/lib/dummy-pops";
import { findPopsByAuthor } from "@/lib/pops";
import {
  getComments,
  getLikeCount,
  getMessages,
  getSocialVersion,
  sendMessage,
  subscribeSocial,
} from "@/lib/social";
import { canEditPop, getPopsVersion, subscribePops } from "@/lib/user-pops";

export function AuthorProfile({ name }: { name: string }) {
  useSyncExternalStore(subscribeSocial, getSocialVersion, () => 0);
  const popsVersion = useSyncExternalStore(subscribePops, getPopsVersion, () => 0);
  const { profile } = useAuth();
  const router = useRouter();
  const [pops, setPops] = useState(() => findPopsByAuthor(name));
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [editingPop, setEditingPop] = useState<Pop | null>(null);
  const isSelf = Boolean(profile && profile.name === name);
  const messages = getMessages(name);

  useEffect(() => {
    setPops(findPopsByAuthor(name));
  }, [name, popsVersion]);

  async function onSend(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || isSelf) return;
    if (!profile) {
      router.push(`/login?next=/users/${encodeURIComponent(name)}`);
      return;
    }
    try {
      await sendMessage(profile.name, name, draft);
      setDraft("");
      setError("");
    } catch {
      setError("メッセージを送れませんでした");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="mt-1 text-sm text-zinc-400">{pops.length}件のPOP</p>
      {isSelf ? (
        <p className="mt-2 text-xs text-zinc-500">
          自分の投稿は、詳細画面の「投稿内容を修正」からタイトルや日付を変えられます
        </p>
      ) : null}

      <ul className="mt-4 grid grid-cols-3 gap-1">
        {pops.map((pop) => (
          <li key={pop.id}>
            <Link href={`/pops/${encodeURIComponent(pop.id)}`} className="block">
              <article className="relative aspect-[210/297] overflow-hidden bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pop.image}
                  alt={pop.title}
                  className="size-full object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-black/50 px-1 py-1 text-[10px]">
                  <span className="flex items-center gap-0.5">
                    <HeartIcon className="size-3" />
                    {getLikeCount(pop.id)}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <CommentIcon className="size-3" />
                    {getComments(pop.id).length}
                  </span>
                </div>
              </article>
            </Link>
            {canEditPop(pop, profile?.uid) ? (
              <button
                type="button"
                onClick={() => setEditingPop(pop)}
                className="mt-1 block w-full text-center text-[10px] text-zinc-500 underline decoration-white/20 underline-offset-2"
              >
                投稿内容を修正
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold">メッセージ</h2>
        {isSelf ? (
          <p className="text-sm text-zinc-500">自分のページにはメッセージを送れません</p>
        ) : (
          <>
            <ul className="mb-4 space-y-2">
              {messages.length === 0 ? (
                <li className="text-sm text-zinc-500">まだメッセージはありません</li>
              ) : (
                messages.map((message) => (
                  <li
                    key={message.id}
                    className="rounded-lg bg-zinc-900 px-3 py-2 text-sm"
                  >
                    <p className="text-[10px] text-zinc-500">{message.from}</p>
                    <p>{message.text}</p>
                  </li>
                ))
              )}
            </ul>
            <form onSubmit={(event) => void onSend(event)} className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`${name} にメッセージ`}
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
          </>
        )}
      </section>
      {editingPop ? (
        <EditPopDialog pop={editingPop} onClose={() => setEditingPop(null)} />
      ) : null}
    </div>
  );
}
