import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "ログイン | D-POP",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <h1 className="text-center text-base font-bold">ログイン</h1>
      </header>
      <AuthForm mode="login" nextPath={next || "/mypage"} />
    </div>
  );
}
