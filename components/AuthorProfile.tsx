"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CommentIcon, HeartIcon } from "@/components/Icons";
import { CreditLinks } from "@/components/CreditLinks";
import { EditPopDialog } from "@/components/EditPopDialog";
import { RequestForm } from "@/components/RequestForm";
import { useAuth } from "@/lib/auth-context";
import { type Pop } from "@/lib/dummy-pops";
import { findPopById, findPopsByAuthor } from "@/lib/pops";
import {
  getComments,
  getLikeCount,
  getMessages,
  getSocialVersion,
  subscribeSocial,
} from "@/lib/social";
import { canEditPop, getPopsVersion, subscribePops } from "@/lib/user-pops";
import {
  findProfileByName,
  getProfilesVersion,
  subscribeProfiles,
} from "@/lib/profiles";

export function AuthorProfile({
  name,
  fromPopId,
}: {
  name: string;
  fromPopId?: string;
}) {
  useSyncExternalStore(subscribeSocial, getSocialVersion, () => 0);
  useSyncExternalStore(subscribeProfiles, getProfilesVersion, () => 0);
  const popsVersion = useSyncExternalStore(subscribePops, getPopsVersion, () => 0);
  const { profile } = useAuth();
  const [pops, setPops] = useState(() => findPopsByAuthor(name));
  const [editingPop, setEditingPop] = useState<Pop | null>(null);
  const isSelf = Boolean(profile && profile.name === name);
  const messages = getMessages(name);
  const fromPop = fromPopId ? findPopById(fromPopId) : undefined;
  const publicProfile = findProfileByName(name);

  useEffect(() => {
    setPops(findPopsByAuthor(name));
  }, [name, popsVersion]);

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="mt-1 text-sm text-zinc-400">{pops.length}件のPOP</p>
      <CreditLinks
        profile={publicProfile}
        area={pops.find((pop) => pop.prefecture)?.prefecture}
      />
      {isSelf ? (
        <p className="mt-2 text-xs text-zinc-500">
          届いた依頼は下に表示されます。作品の修正は各画像の「投稿内容を修正」からできます。
        </p>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          見る → いいねやコメントで評価する → 雰囲気を参考にする → 下から制作を依頼する。
          同じものを無断で作って出すことはできません。
        </p>
      )}

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

      <section id="request" className="mt-8 scroll-mt-24">
        <h2 className="mb-3 text-sm font-bold">
          {isSelf ? "届いた依頼" : "制作を依頼"}
        </h2>
        {isSelf ? (
          <ul className="space-y-2">
            {messages.length === 0 ? (
              <li className="text-sm text-zinc-500">まだ依頼はありません</li>
            ) : (
              messages.map((message) => (
                <li
                  key={message.id}
                  className="whitespace-pre-wrap rounded-lg bg-zinc-900 px-3 py-2 text-sm"
                >
                  <p className="text-[10px] text-zinc-500">{message.from}</p>
                  <p className="mt-1">{message.text}</p>
                </li>
              ))
            )}
          </ul>
        ) : (
          <RequestForm author={name} fromTitle={fromPop?.title} />
        )}
      </section>
      {editingPop ? (
        <EditPopDialog pop={editingPop} onClose={() => setEditingPop(null)} />
      ) : null}
    </div>
  );
}
