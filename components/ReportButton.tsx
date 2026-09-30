"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { reportPop } from "@/lib/social";

export function ReportButton({ popTitle }: { popTitle: string }) {
  const { profile } = useAuth();
  const router = useRouter();

  async function onReport(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!profile) {
      router.push("/login");
      return;
    }
    const ok = window.confirm("不適切なコンテンツとして報告しますか？");
    if (!ok) return;
    try {
      await reportPop(popTitle);
      window.alert(
        `「${popTitle}」を不適切なコンテンツとして報告しました。ご協力ありがとうございます。`,
      );
    } catch {
      window.alert("報告を保存できませんでした。時間をおいて再度お試しください。");
    }
  }

  return (
    <button
      type="button"
      onClick={(event) => void onReport(event)}
      className="ml-auto text-xs text-zinc-500 hover:text-zinc-300"
    >
      この画像を通報する
    </button>
  );
}
