export function UseNotice({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      画像の無断転載・商用利用は禁止です。保存できても、利用には権利者の許可が必要です（
      <a href="/terms" className="text-zinc-100 underline decoration-white/50 underline-offset-2">
        利用規約
      </a>
      ）。
    </p>
  );
}
