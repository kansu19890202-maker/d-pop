export type SocialComment = {
  id: string;
  author: string;
  text: string;
  createdAt: number;
};

export type SocialMessage = {
  id: string;
  from: string;
  to: string;
  text: string;
  createdAt: number;
};

type SocialState = {
  likes: Record<string, number>;
  liked: Record<string, boolean>;
  comments: Record<string, SocialComment[]>;
  messages: Record<string, SocialMessage[]>;
};

const STORAGE_KEY = "dpop-social-v2";
const EVENT = "dpop-social";

const seedLikes: Record<string, number> = {
  "1": 18,
  "2": 9,
  "3": 31,
  "4": 4,
  "5": 7,
  "6": 22,
  "7": 15,
  "8": 11,
  "9": 6,
  "10": 3,
  "11": 8,
  "12": 5,
  "13": 12,
};

const seedComments: Record<string, SocialComment[]> = {
  "1": [
    {
      id: "c1",
      author: "ゲスト2041",
      text: "ポスターの色味が最高です",
      createdAt: Date.parse("2025-04-21T12:00:00"),
    },
  ],
  "6": [
    {
      id: "c2",
      author: "ゲスト8812",
      text: "今週末行きます！",
      createdAt: Date.parse("2024-10-27T09:00:00"),
    },
    {
      id: "c3",
      author: "ゲスト3301",
      text: "デザイン参考にさせてください",
      createdAt: Date.parse("2024-10-27T18:00:00"),
    },
  ],
};

let memory: SocialState | null = null;
let version = 0;

function emptyState(): SocialState {
  return {
    likes: { ...seedLikes },
    liked: {},
    comments: Object.fromEntries(
      Object.entries(seedComments).map(([id, list]) => [id, [...list]]),
    ),
    messages: {},
  };
}

function loadState(): SocialState {
  if (memory) return memory;
  if (typeof window === "undefined") {
    memory = emptyState();
    return memory;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      memory = emptyState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
      return memory;
    }
    const parsed = JSON.parse(raw) as Partial<SocialState>;
    const seededComments = emptyState().comments;
    memory = {
      likes: { ...seedLikes, ...parsed.likes },
      liked: parsed.liked ?? {},
      comments: mergeComments(seededComments, parsed.comments ?? {}),
      messages: parsed.messages ?? {},
    };
    return memory;
  } catch {
    memory = emptyState();
    return memory;
  }
}

function mergeComments(
  seeds: Record<string, SocialComment[]>,
  stored: Record<string, SocialComment[]>,
): Record<string, SocialComment[]> {
  const ids = new Set([...Object.keys(seeds), ...Object.keys(stored)]);
  const next: Record<string, SocialComment[]> = {};
  for (const id of ids) {
    const byId = new Map<string, SocialComment>();
    for (const comment of seeds[id] ?? []) byId.set(comment.id, comment);
    for (const comment of stored[id] ?? []) byId.set(comment.id, comment);
    next[id] = [...byId.values()].sort((a, b) => a.createdAt - b.createdAt);
  }
  return next;
}

function persist() {
  if (typeof window === "undefined" || !memory) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  version += 1;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeSocial(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function getSocialVersion() {
  return version;
}

export function getLikeCount(popId: string) {
  const stored = loadState().likes[popId];
  const seeded = seedLikes[popId] ?? 0;
  if (typeof stored !== "number") return seeded;
  return Math.max(seeded, stored);
}

export function hasLiked(popId: string) {
  return Boolean(loadState().liked[popId]);
}

export function toggleLike(popId: string) {
  const state = loadState();
  const liked = Boolean(state.liked[popId]);
  const current = state.likes[popId] ?? 0;
  state.liked[popId] = !liked;
  state.likes[popId] = Math.max(0, current + (liked ? -1 : 1));
  persist();
}

export function getComments(popId: string): SocialComment[] {
  return loadState().comments[popId] ?? [];
}

export function addComment(popId: string, author: string, text: string) {
  const state = loadState();
  const next: SocialComment = {
    id: `c-${Date.now()}`,
    author,
    text: text.trim(),
    createdAt: Date.now(),
  };
  state.comments[popId] = [...(state.comments[popId] ?? []), next];
  persist();
}

export function getMessages(withAuthor: string): SocialMessage[] {
  return loadState().messages[withAuthor] ?? [];
}

export function sendMessage(from: string, to: string, text: string) {
  const state = loadState();
  const next: SocialMessage = {
    id: `m-${Date.now()}`,
    from,
    to,
    text: text.trim(),
    createdAt: Date.now(),
  };
  state.messages[to] = [...(state.messages[to] ?? []), next];
  persist();
}
