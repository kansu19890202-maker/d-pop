"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { popularTags, type Pop } from "@/lib/dummy-pops";
import {
  dateToDigits,
  fileToPreview,
  normalizeTag,
  parseEightDigitDate,
} from "@/lib/post-fields";
import {
  AUTHOR_MAX_LENGTH,
  canEditPop,
  saveUserPop,
  updatePop,
} from "@/lib/user-pops";

type PostFormProps = {
  initialPop?: Pop;
};

export function PostForm({ initialPop }: PostFormProps) {
  const router = useRouter();
  const { loading, profile, configured } = useAuth();
  const editing = Boolean(initialPop);
  const [title, setTitle] = useState(initialPop?.title ?? "");
  const [date, setDate] = useState(
    initialPop ? dateToDigits(initialPop.date) : "",
  );
  const [image, setImage] = useState<string | null>(initialPop?.image ?? null);
  const [file, setFile] = useState<File | undefined>();
  const [fileName, setFileName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialPop?.tags.filter((tag) => popularTags.includes(tag)) ?? [],
  );
  const [customTags, setCustomTags] = useState<string[]>(
    initialPop?.tags.filter((tag) => !popularTags.includes(tag)) ?? [],
  );
  const [tagDraft, setTagDraft] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!initialPop || loading) return;
    setForbidden(!canEditPop(initialPop, profile?.uid));
  }, [initialPop, loading, profile?.uid]);

  async function onFileChange(next: File | undefined) {
    if (!next) return;
    setError("");
    setFileName(next.name);
    setFile(next);
    try {
      const preview = await fileToPreview(next);
      setImage(preview);
    } catch {
      setError("画像を読み込めませんでした");
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  function addCustomTag() {
    const tag = normalizeTag(tagDraft);
    if (!tag) return;
    if (popularTags.includes(tag)) {
      setSelectedTags((current) =>
        current.includes(tag) ? current : [...current, tag],
      );
    } else {
      setCustomTags((current) =>
        current.includes(tag) ? current : [...current, tag],
      );
    }
    setTagDraft("");
  }

  function removeCustomTag(tag: string) {
    setCustomTags((current) => current.filter((item) => item !== tag));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const formattedDate = parseEightDigitDate(date);
    if (!configured) {
      setError("保存先の接続後に投稿できます");
      return;
    }
    if (!profile) {
      router.push("/login?next=/post");
      return;
    }
    if (!image) {
      setError("POP画像を選んでください");
      return;
    }
    if (!title.trim()) {
      setError("イベント名（タイトル）を入力してください");
      return;
    }
    if (!formattedDate) {
      setError("日付は 20260909 のように8桁の数字で入力してください");
      return;
    }

    setBusy(true);
    setError("");
    const tags = [...selectedTags, ...customTags];
    try {
      if (editing && initialPop) {
        await updatePop(initialPop, {
          title: title.trim(),
          date: formattedDate,
          tags,
          file,
        });
        router.push(`/pops/${encodeURIComponent(initialPop.id)}`);
        router.refresh();
        return;
      }
      if (!file) {
        setError("POP画像を選んでください");
        setBusy(false);
        return;
      }
      const pop = await saveUserPop({
        title: title.trim(),
        date: formattedDate,
        author: profile.name,
        authorId: profile.uid,
        tags,
        file,
      });
      router.push(`/pops/${encodeURIComponent(pop.id)}`);
      router.refresh();
    } catch {
      setError("保存できませんでした。画像サイズや通信環境を確認してください");
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="px-4 py-16" />;
  }

  if (!profile) {
    return (
      <div className="px-4 py-16 text-center text-sm text-zinc-400">
        <p>投稿するにはログインが必要です</p>
        <p className="mt-4 flex justify-center gap-3">
          <Link href="/login?next=/post" className="text-white underline">
            ログイン
          </Link>
          <Link href="/register" className="text-white underline">
            新規登録
          </Link>
        </p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <p className="px-4 py-16 text-center text-sm text-zinc-400">
        この投稿を編集できるのは投稿者本人だけです
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5 px-4 py-6">
      <div>
        <span className="mb-2 block text-sm text-zinc-300">POP画像</span>
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onFileChange(event.target.files?.[0])}
            className="sr-only"
          />
          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
            {editing ? "画像を変更" : "ファイルを選択"}
          </span>
          <span className="text-sm text-zinc-400">
            {fileName || (editing ? "いまの画像を使う" : "選択されていません")}
          </span>
        </label>
      </div>

      <div className="aspect-[210/297] overflow-hidden rounded-sm bg-zinc-950">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="プレビュー" className="size-full object-contain" />
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-zinc-500">
            A4サイズを想定したプレビュー
          </p>
        )}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm text-zinc-300">
          イベント名（タイトル）
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-zinc-300">日付</span>
        <input
          inputMode="numeric"
          pattern="\d{8}"
          maxLength={8}
          value={date}
          onChange={(event) =>
            setDate(event.target.value.replace(/\D/g, "").slice(0, 8))
          }
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
          placeholder="20260909"
        />
        <span className="mt-1 block text-xs text-zinc-500">
          8桁の数字で入力（例: 20260909）
        </span>
      </label>

      <p className="text-sm text-zinc-400">
        投稿者：{editing ? initialPop?.author : profile.name}
        <span className="mt-1 block text-xs text-zinc-500">
          表示名はマイページで変更できます（{AUTHOR_MAX_LENGTH}文字まで）
        </span>
      </p>

      <fieldset>
        <legend className="mb-2 text-sm text-zinc-300">タグ</legend>
        <div className="mb-3 flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  selected
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-300 ring-1 ring-white/10"
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {customTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeCustomTag(tag)}
              className="rounded-full bg-white px-3 py-1.5 text-xs text-black"
            >
              #{tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagDraft}
            onChange={(event) => setTagDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomTag();
              }
            }}
            className="min-w-0 flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/40"
            placeholder="ダーツ"
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="shrink-0 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-black"
          >
            追加
          </button>
        </div>
        <span className="mt-1 block text-xs text-zinc-500">
          #は不要です。文字を入れて追加を押すだけです
        </span>
      </fieldset>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-white py-3 text-sm font-bold text-black disabled:opacity-60"
      >
        {editing ? "変更を保存" : "投稿する"}
      </button>
    </form>
  );
}
