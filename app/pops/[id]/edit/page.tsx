import Link from "next/link";
import { EditPop } from "@/components/EditPop";

export default async function EditPopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-3">
        <Link
          href={`/pops/${id}`}
          className="text-sm text-zinc-400"
        >
          ← 詳細
        </Link>
        <h1 className="mt-2 text-center text-base font-bold">投稿を編集</h1>
      </header>
      <EditPop popId={decodeURIComponent(id)} />
    </div>
  );
}
