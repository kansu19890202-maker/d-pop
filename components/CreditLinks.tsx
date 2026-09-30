import { instagramUrl, webUrl, xUrl } from "@/lib/links";
import { type PublicProfile } from "@/lib/profiles";

export function CreditLinks({
  profile,
  area,
}: {
  profile?: PublicProfile;
  area?: string;
}) {
  const instagram = profile ? instagramUrl(profile.instagram) : "";
  const x = profile ? xUrl(profile.x) : "";
  const store = profile ? webUrl(profile.storeUrl) : "";
  const prefecture = profile?.prefecture || area || "";
  if (!instagram && !x && !store && !prefecture) return null;
  return (
    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-300">
      {prefecture ? <span>{prefecture}</span> : null}
      {instagram ? (
        <a href={instagram} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4">
          Instagram
        </a>
      ) : null}
      {x ? (
        <a href={x} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4">
          X
        </a>
      ) : null}
      {store ? (
        <a href={store} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4">
          店舗サイト
        </a>
      ) : null}
    </p>
  );
}
