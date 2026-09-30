import Link from "next/link";
import { UseNotice } from "@/components/UseNotice";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black px-4 py-6 pb-24 text-center text-xs text-zinc-500">
      <UseNotice className="mx-auto max-w-xl leading-relaxed" />
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/guide" className="hover:text-zinc-300">
          見る・評価・依頼
        </Link>
        <span aria-hidden="true">|</span>
        <Link href="/terms" className="hover:text-zinc-300">
          利用規約
        </Link>
        <span aria-hidden="true">|</span>
        <Link href="/privacy" className="hover:text-zinc-300">
          プライバシーポリシー
        </Link>
      </nav>
      <p className="mt-3 text-zinc-600">© D-POP</p>
    </footer>
  );
}
