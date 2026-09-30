import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "見る・評価・依頼 | D-POP",
};

const steps = [
  {
    n: "1",
    title: "見る",
    body: "ギャラリーでPOPを眺めます。作者名を開けば、その人の他の作品もまとめて見られます。",
  },
  {
    n: "2",
    title: "評価する",
    body: "いいねとコメントは、作者へのいちばん簡単な返事です。",
  },
  {
    n: "3",
    title: "参考にする",
    body: "雰囲気や情報の置き方を学ぶのは歓迎です。保存した画像を、許可なく転載したり、ほぼ同じものを作って出すことはできません。",
  },
  {
    n: "4",
    title: "依頼する",
    body: "「この人に頼みたい」と思ったら、作品の詳細から作者ページへ進み、制作依頼を送ります。条件は作者と直接やりとりします。",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-3">
        <Link href="/" className="text-sm text-zinc-400">
          ← ホーム
        </Link>
      </header>
      <article className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-xl font-bold">見る、評価する、依頼する</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          D-POPは、作った人が見てもらい、反応をもらい、必要なら仕事の相談が届く場所です。派手な募集ではなく、作品の隣から自然に依頼できるようにしています。
        </p>
        <ol className="mt-8 space-y-5">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs text-zinc-300 ring-1 ring-white/10">
                {step.n}
              </span>
              <div>
                <h2 className="text-sm font-bold">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-xs leading-relaxed text-zinc-500">
          画像はブラウザの機能で保存できてしまいますが、著作権は作者にあります。無断転載・商用利用は利用規約で禁止しています。
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm text-white underline decoration-white/30 underline-offset-4">
            ギャラリーを見る
          </Link>
        </p>
      </article>
    </div>
  );
}
