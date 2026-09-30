import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "新規登録 | D-POP",
};

export default function RegisterPage() {
  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <h1 className="text-center text-base font-bold">アカウント登録</h1>
      </header>
      <AuthForm mode="register" nextPath="/mypage" />
    </div>
  );
}
