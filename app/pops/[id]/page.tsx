import Link from "next/link";
import { PopDetail } from "@/components/PopDetail";

export default async function PopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-3">
        <Link href="/" className="text-sm text-zinc-400">
          ← ホーム
        </Link>
      </header>
      <PopDetail popId={decodeURIComponent(id)} />
    </div>
  );
}
