"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { AuthorProfile } from "@/components/AuthorProfile";
import { HeartIcon } from "@/components/Icons";
import { useAuth } from "@/lib/auth-context";
import { findPopById } from "@/lib/pops";
import { PREFECTURES } from "@/lib/regions";
import {
  getLikeCount,
  getSocialVersion,
  listBookmarkIds,
  subscribeSocial,
} from "@/lib/social";
import { AUTHOR_MAX_LENGTH, getPopsVersion, subscribePops } from "@/lib/user-pops";

export default function MyPage() {
  const { loading, profile, configured, logout, updateName, updatePublicProfile } =
    useAuth();
  const socialVersion = useSyncExternalStore(subscribeSocial, getSocialVersion, () => 0);
  const popsVersion = useSyncExternalStore(subscribePops, getPopsVersion, () => 0);
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [x, setX] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const savedPops = useMemo(
    () => listBookmarkIds().map(findPopById).filter((pop) => Boolean(pop)),
    [socialVersion, popsVersion],
  );

  if (loading) {
    return <div className="min-h-full bg-black pb-24" />;
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-black pb-24 text-white">
        <header className="border-b border-white/10 px-4 py-4">
          <h1 className="text-center text-base font-bold">マイページ</h1>
        </header>
        <div className="mx-auto max-w-md space-y-4 px-4 py-10 text-center">
          <p className="text-sm text-zinc-400">
            投稿・いいね・コメント・保存を使うには、アカウント登録が必要です。画像は専用の格納庫に保管されます。
          </p>
          {!configured ? (
            <p className="text-left text-xs leading-relaxed text-zinc-500">
              Firebase コンソールで Authentication（メール）、Firestore、Storage
              を有効にし、ウェブアプリの設定値を Vercel の Environment Variables
              に入れて再デプロイしてください。承認済みドメインに
              localhost、d-pop.vercel.app、www.d-pop.darts-tech.jp
              を追加します。ルールはリポジトリの firestore.rules と storage.rules
              をコンソールに貼り付けます。
            </p>
          ) : null}
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-zinc-800 px-5 py-2 text-sm font-medium text-white"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function onSaveName(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      await updateName(name || profile!.name);
      setMessage("表示名を更新しました");
      setName("");
    } catch {
      setMessage("更新できませんでした");
    } finally {
      setSaving(false);
    }
  }

  async function onSavePublic(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      await updatePublicProfile({
        instagram: instagram || profile!.instagram,
        x: x || profile!.x,
        prefecture: prefecture || profile!.prefecture,
        storeUrl: storeUrl || profile!.storeUrl,
      });
      setMessage("公開プロフィールを更新しました");
      setInstagram("");
      setX("");
      setPrefecture("");
      setStoreUrl("");
    } catch {
      setMessage("更新できませんでした");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <h1 className="text-center text-base font-bold">マイページ</h1>
      </header>
      <div className="mx-auto max-w-xl px-4 pt-6">
        <p className="text-sm text-zinc-400">{profile.email}</p>
        <form onSubmit={onSaveName} className="mt-3 flex gap-2">
          <input
            value={name}
            maxLength={AUTHOR_MAX_LENGTH}
            onChange={(event) => setName(event.target.value)}
            placeholder={profile.name}
            className="min-w-0 flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          >
            名前を変更
          </button>
        </form>
        <form onSubmit={onSavePublic} className="mt-4 space-y-2">
          <p className="text-xs text-zinc-400">
            投稿の宣伝になる公開リンクです。空欄の項目は今の値のまま残ります。
          </p>
          <input
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
            placeholder={profile.instagram || "Instagram（@なし）"}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
          />
          <input
            value={x}
            onChange={(event) => setX(event.target.value)}
            placeholder={profile.x || "X（@なし）"}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
          />
          <input
            value={storeUrl}
            onChange={(event) => setStoreUrl(event.target.value)}
            placeholder={profile.storeUrl || "店舗サイトURL"}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
          />
          <div className="flex gap-2">
            <select
              value={prefecture || profile.prefecture}
              onChange={(event) => setPrefecture(event.target.value)}
              className="min-w-0 flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
            >
              <option value="">エリア未設定</option>
              {PREFECTURES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              公開情報を保存
            </button>
          </div>
        </form>
        {message ? <p className="mt-2 text-xs text-zinc-500">{message}</p> : null}
        <button
          type="button"
          onClick={() => logout()}
          className="mt-4 text-xs text-zinc-500"
        >
          ログアウト
        </button>
      </div>
      {savedPops.length > 0 ? (
        <section className="mx-auto max-w-xl px-4 pt-8">
          <h2 className="text-sm font-bold">保存したPOP</h2>
          <ul className="mt-3 grid grid-cols-3 gap-1">
            {savedPops.map((pop) =>
              pop ? (
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
                      </div>
                    </article>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
      <AuthorProfile name={profile.name} />
    </div>
  );
}
