"use client";

import { useEffect, useState } from "react";
import { AuthorProfile } from "@/components/AuthorProfile";
import { readAuthorName } from "@/lib/user-pops";

export default function MyPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(readAuthorName());
  }, []);

  if (!name) {
    return <div className="min-h-full bg-black pb-24" />;
  }

  return (
    <div className="min-h-full bg-black pb-24 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <h1 className="text-center text-base font-bold">マイページ</h1>
      </header>
      <AuthorProfile name={name} />
    </div>
  );
}
