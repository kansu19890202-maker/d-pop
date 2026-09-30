import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black px-4 py-6 pb-24 text-center text-xs text-zinc-500">
      <nav className="flex items-center justify-center gap-4">
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
