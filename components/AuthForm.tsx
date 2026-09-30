"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authErrorMessage, useAuth } from "@/lib/auth-context";

type AuthFormProps = {
  mode: "login" | "register";
  nextPath?: string;
};

export function AuthForm({ mode, nextPath = "/mypage" }: AuthFormProps) {
  const { register, login, resetPassword, configured } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setInfo("");
    if (!configured) {
      setError("本番のアカウント機能を接続中です。しばらくしてから再度お試しください");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("リセット用のメールアドレスを入力してください");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email);
      setInfo("パスワード再設定のメールを送信しました");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 px-4 py-6">
      {!configured ? (
        <p className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
          アカウント・投稿の保存先を接続すると、ここから登録できるようになります。
        </p>
      ) : null}
      {mode === "register" ? (
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">表示名</span>
          <input
            value={name}
            maxLength={20}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
            placeholder="Boomのがんちゃん"
          />
        </label>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm text-zinc-300">メールアドレス</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-zinc-300">パスワード</span>
        <input
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
        />
      </label>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {info ? <p className="text-sm text-emerald-400">{info}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-white py-3 text-sm font-bold text-black disabled:opacity-60"
      >
        {mode === "register" ? "アカウントを作成" : "ログイン"}
      </button>
      {mode === "login" ? (
        <button
          type="button"
          onClick={onReset}
          disabled={busy}
          className="w-full text-center text-xs text-zinc-500"
        >
          パスワードを忘れた場合
        </button>
      ) : null}
      <p className="text-center text-sm text-zinc-400">
        {mode === "register" ? (
          <>
            すでにアカウントがある方は{" "}
            <Link href="/login" className="text-white underline">
              ログイン
            </Link>
          </>
        ) : (
          <>
            初めての方は{" "}
            <Link href="/register" className="text-white underline">
              新規登録
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
