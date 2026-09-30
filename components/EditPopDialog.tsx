"use client";

import { useEffect, useRef } from "react";
import { PostForm } from "@/components/PostForm";
import { type Pop } from "@/lib/dummy-pops";

type EditPopDialogProps = {
  pop: Pop;
  onClose: () => void;
};

export function EditPopDialog({ pop, onClose }: EditPopDialogProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-pop-title"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-zinc-950 text-white shadow-2xl ring-1 ring-white/15 sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 id="edit-pop-title" className="text-base font-bold">
            投稿を修正
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-zinc-400"
          >
            閉じる
          </button>
        </div>
        <div className="overflow-y-auto px-4 pb-8">
          <PostForm
            key={pop.id}
            initialPop={pop}
            compact
            onSaved={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
