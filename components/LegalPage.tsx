import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-black text-zinc-300">
      <header className="border-b border-white/10 px-4 py-3">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← ホーム
        </Link>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <div className="space-y-8 text-sm leading-7 sm:text-[15px]">{children}</div>
      </article>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}
