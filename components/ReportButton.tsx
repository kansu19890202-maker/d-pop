"use client";

import type { MouseEvent } from "react";

export function ReportButton({ popTitle }: { popTitle: string }) {
  function onReport(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const ok = window.confirm("不適切なコンテンツとして報告しますか？");
    if (ok) {
      window.alert(
        `「${popTitle}」を不適切なコンテンツとして報告しました。ご協力ありがとうございます。`,
      );
    }
  }

  return (
    <button
      type="button"
      onClick={onReport}
      className="ml-auto text-xs text-zinc-500 hover:text-zinc-300"
    >
      この画像を通報する
    </button>
  );
}
