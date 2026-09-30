"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { sendMessage } from "@/lib/social";

type RequestFormProps = {
  author: string;
  fromTitle?: string;
};

export function RequestForm({ author, fromTitle }: RequestFormProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!profile) {
      router.push(
        `/login?next=${encodeURIComponent(`/users/${author}?request=1`)}`,
      );
      return;
    }
    if (!body.trim()) {
      setError("依頼内容を書いてください");
      return;
    }
    const lines = [
      "【制作依頼】",
      fromTitle ? `参考作品：${fromTitle}` : "",
      date.trim() ? `希望日：${date.trim()}` : "",
      place.trim() ? `店舗・用途：${place.trim()}` : "",
      "",
      body.trim(),
    ].filter((line) => line !== "");
    const text = lines.join("\n").slice(0, 500);
    setBusy(true);
    setError("");
    try {
      await sendMessage(profile.name, author, text);
      setDone(true);
      setBody("");
    } catch {
      setError("送れませんでした。ログインと通信を確認してください");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-lg bg-zinc-900 px-3 py-3 text-sm text-zinc-300">
        依頼を送りました。あとは作者からの返事を待ってください。条件や料金はお互いのメッセージで決めてください。
      </p>
    );
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-3">
      {fromTitle ? (
        <p className="text-xs text-zinc-500">参考にした作品：{fromTitle}</p>
      ) : null}
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-400">希望のイベント日</span>
        <input
          value={date}
          onChange={(event) => setDate(event.target.value)}
          placeholder="例: 2026.10.12"
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-400">店舗・用途</span>
        <input
          value={place}
          onChange={(event) => setPlace(event.target.value)}
          placeholder="例: ダーツバーの来店告知"
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-400">依頼内容</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value.slice(0, 320))}
          rows={4}
          placeholder="サイズ、人数、雰囲気、納期など"
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
        />
      </label>
      <p className="text-[11px] leading-relaxed text-zinc-500">
        依頼は作者との直接のやりとりです。料金・納品はD-POPでは仲介しません。
      </p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
      >
        依頼を送る
      </button>
    </form>
  );
}
