import type { Metadata } from "next";
import { PostForm } from "@/components/PostForm";

export const metadata: Metadata = {
  title: "投稿する | D-POP",
};

export default function PostPage() {
  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <h1 className="text-center text-base font-bold">POPを投稿</h1>
      </header>
      <PostForm />
    </div>
  );
}
