import Link from "next/link";
import { UseNotice } from "@/components/UseNotice";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/15 bg-black px-4 py-6 pb-24 text-center text-xs text-zinc-300">
      <UseNotice className="mx-auto max-w-xl leading-relaxed" />
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-zinc-200">
        <Link href="/guide" className="hover:text-white">
          見る・評価・依頼
        </Link>
        <span aria-hidden="true" className="text-zinc-500">
          |
        </span>
        <Link href="/terms" className="hover:text-white">
          利用規約
        </Link>
        <span aria-hidden="true" className="text-zinc-500">
          |
        </span>
        <Link href="/privacy" className="hover:text-white">
          プライバシーポリシー
        </Link>
        <span aria-hidden="true" className="text-zinc-500">
          |
        </span>
        <Link href="/contact" className="hover:text-white">
          お問い合わせ・権利侵害窓口
        </Link>
      </nav>
      <p className="mt-3 text-zinc-400">© D-POP</p>
    </footer>
  );
}
