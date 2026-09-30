"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthorProfile } from "@/components/AuthorProfile";
import { useAuth } from "@/lib/auth-context";
import { AUTHOR_MAX_LENGTH } from "@/lib/user-pops";

export default function MyPage() {
  const { loading, profile, configured, logout, updateName } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
            投稿・いいね・コメントを保存するには、アカウント登録が必要です。画像は専用の格納庫に保管されます。
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
        {message ? <p className="mt-2 text-xs text-zinc-500">{message}</p> : null}
        <button
          type="button"
          onClick={() => logout()}
          className="mt-4 text-xs text-zinc-500"
        >
          ログアウト
        </button>
      </div>
      <AuthorProfile name={profile.name} />
    </div>
  );
}
