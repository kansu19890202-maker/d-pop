"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CommentIcon, EyeIcon, HeartIcon } from "@/components/Icons";
import { popularTags, type Pop } from "@/lib/dummy-pops";
import {
  getComments,
  getLikeCount,
  getSocialVersion,
  getViewCount,
  subscribeSocial,
} from "@/lib/social";
import {
  getPopsVersion,
  listAllPops,
  subscribePops,
} from "@/lib/user-pops";

type GalleryProps = {
  pops: Pop[];
};

export function Gallery({ pops }: GalleryProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  useSyncExternalStore(subscribeSocial, getSocialVersion, () => 0);
  const popsVersion = useSyncExternalStore(subscribePops, getPopsVersion, () => 0);
  const [allPops, setAllPops] = useState<Pop[]>(pops);

  useEffect(() => {
    setAllPops(listAllPops());
  }, [pops, popsVersion]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPops.filter((pop) => {
      const matchesTag = !activeTag || pop.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        pop.title.toLowerCase().includes(q) ||
        pop.date.toLowerCase().includes(q) ||
        pop.author.toLowerCase().includes(q) ||
        pop.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [allPops, query, activeTag]);

  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <div className="bg-[#f4f5f5]">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-5 sm:py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dpop-logo.svg"
            alt="D-POP"
            className="h-12 w-auto object-contain sm:h-16"
          />
        </div>
      </div>

      <div className="overflow-hidden border-y border-white/10 bg-zinc-950 py-2">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, copy) => (
            <p
              key={copy}
              className="flex shrink-0 items-center gap-8 px-8 text-xs tracking-wide text-zinc-300 sm:text-sm"
            >
              <span>
                D-POPは、ダーツバーや大会で使われるイベントPOPを集めてシェアするギャラリーサイトです。
              </span>
              <span aria-hidden="true">◆</span>
              <span>
                店頭に貼る告知、トーナメントのチラシ、選手コラボのポスターなどを、新しい順に眺めて探せます。
              </span>
              <span aria-hidden="true">◆</span>
              <span>
                気になるイベントは検索やタグから探せます。自分で作ったPOPは、下の「投稿する」からシェアできます。
              </span>
              <span aria-hidden="true">◆</span>
            </p>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-3 py-3 sm:px-4">
          <label className="relative block">
            <span className="sr-only">イベントを検索</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="イベント名・日付・投稿者を検索"
              className="w-full rounded-full bg-zinc-900 py-2 pl-9 pr-4 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-white/40"
            />
          </label>
        </div>
        <div className="mx-auto max-w-5xl border-t border-white/10">
          <div className="flex gap-2 overflow-x-auto px-3 py-2.5 scrollbar-none sm:px-4">
            {popularTags.map((tag) => {
              const selected = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setActiveTag((current) => (current === tag ? null : tag))
                  }
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                    selected
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-200 ring-1 ring-white/10 hover:bg-zinc-800"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl">
        {filtered.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm text-zinc-400">
            条件に一致するPOPはありません
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 p-2 md:grid-cols-3 md:gap-3 md:p-3">
            {filtered.map((pop) => (
              <li key={pop.id}>
                <Link href={`/pops/${encodeURIComponent(pop.id)}`} className="block">
                  <article className="group relative aspect-[210/297] overflow-hidden rounded-sm bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pop.image}
                      alt={`${pop.title}（${pop.date} / ${pop.author}）`}
                      className="absolute inset-0 size-full object-contain transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-left sm:p-3">
                      <p className="truncate text-xs font-bold sm:text-sm">
                        {pop.title}
                      </p>
                      <p className="truncate text-[10px] text-zinc-300 sm:text-xs">
                        {pop.date}
                      </p>
                      <p className="truncate text-[10px] text-zinc-400 sm:text-xs">
                        {pop.author}
                      </p>
                      <p className="mt-1 flex items-center gap-3 text-[10px] text-zinc-200 sm:text-xs">
                        <span className="inline-flex items-center gap-1">
                          <HeartIcon className="size-3.5 text-red-400" />
                          {getLikeCount(pop.id)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CommentIcon className="size-3.5" />
                          {getComments(pop.id).length}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <EyeIcon className="size-3.5" />
                          {getViewCount(pop.id)}
                        </span>
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
