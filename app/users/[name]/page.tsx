import Link from "next/link";
import { AuthorProfile } from "@/components/AuthorProfile";

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { name } = await params;
  const { from } = await searchParams;
  const author = decodeURIComponent(name);

  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-3">
        <Link href="/" className="text-sm text-zinc-400">
          ← ホーム
        </Link>
      </header>
      <AuthorProfile name={author} fromPopId={from} />
    </div>
  );
}
