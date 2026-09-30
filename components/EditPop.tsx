"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { PostForm } from "@/components/PostForm";
import { type Pop } from "@/lib/dummy-pops";
import { findPopById } from "@/lib/pops";
import { getPopsVersion, subscribePops } from "@/lib/user-pops";

export function EditPop({ popId }: { popId: string }) {
  const popsVersion = useSyncExternalStore(subscribePops, getPopsVersion, () => 0);
  const [pop, setPop] = useState<Pop | undefined>(() => findPopById(popId));

  useEffect(() => {
    setPop(findPopById(popId));
  }, [popId, popsVersion]);

  if (!pop) {
    return (
      <p className="px-4 py-16 text-center text-sm text-zinc-400">
        POPが見つかりません
      </p>
    );
  }

  return <PostForm initialPop={pop} />;
}
