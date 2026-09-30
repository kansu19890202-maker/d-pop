import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";

export type SocialComment = {
  id: string;
  author: string;
  authorId?: string;
  text: string;
  createdAt: number;
};

export type SocialMessage = {
  id: string;
  from: string;
  fromId?: string;
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

let memory: SocialState = {
  likes: { ...seedLikes },
  liked: {},
  comments: Object.fromEntries(
    Object.entries(seedComments).map(([id, list]) => [id, [...list]]),
  ),
  messages: {},
};
let version = 0;

function bump() {
  version += 1;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

function asTime(value: unknown) {
  if (typeof value === "number") return value;
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }
  return Date.now();
}

export function subscribeSocial(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function getSocialVersion() {
  return version;
}

export function startSocialListener() {
  const firebase = getFirebase();
  if (!firebase || typeof window === "undefined") return () => {};

  const stopStats = onSnapshot(collection(firebase.db, "popStats"), (snap) => {
    const likes = { ...seedLikes };
    for (const docSnap of snap.docs) {
      const count = Number(docSnap.data().likeCount ?? 0);
      likes[docSnap.id] = Math.max(likes[docSnap.id] ?? 0, count);
    }
    memory = { ...memory, likes };
    bump();
  });

  const stopMessages = onSnapshot(collection(firebase.db, "messages"), (snap) => {
    const grouped: Record<string, SocialMessage[]> = {};
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const to = String(data.to ?? "");
      if (!to) continue;
      grouped[to] = grouped[to] ?? [];
      grouped[to].push({
        id: docSnap.id,
        from: String(data.from ?? ""),
        fromId: data.fromId ? String(data.fromId) : undefined,
        to,
        text: String(data.text ?? ""),
        createdAt: asTime(data.createdAt),
      });
    }
    for (const list of Object.values(grouped)) {
      list.sort((a, b) => a.createdAt - b.createdAt);
    }
    memory = { ...memory, messages: grouped };
    bump();
  });

  return () => {
    stopStats();
    stopMessages();
  };
}

export function startCommentsListener(popId: string) {
  const firebase = getFirebase();
  if (!firebase || typeof window === "undefined") return () => {};
  return onSnapshot(
    collection(firebase.db, "popStats", popId, "comments"),
    (snap) => {
      const remote = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          author: String(data.author ?? ""),
          authorId: data.authorId ? String(data.authorId) : undefined,
          text: String(data.text ?? ""),
          createdAt: asTime(data.createdAt),
        } satisfies SocialComment;
      });
      const seeded = seedComments[popId] ?? [];
      const byId = new Map<string, SocialComment>();
      for (const comment of seeded) byId.set(comment.id, comment);
      for (const comment of remote) byId.set(comment.id, comment);
      memory = {
        ...memory,
        comments: {
          ...memory.comments,
          [popId]: [...byId.values()].sort((a, b) => a.createdAt - b.createdAt),
        },
      };
      bump();
    },
  );
}

export function getLikeCount(popId: string) {
  return memory.likes[popId] ?? seedLikes[popId] ?? 0;
}

export function hasLiked(popId: string) {
  return Boolean(memory.liked[popId]);
}

export function setLiked(popId: string, liked: boolean) {
  memory = { ...memory, liked: { ...memory.liked, [popId]: liked } };
  bump();
}

export async function refreshLiked(popId: string, uid: string | undefined) {
  const firebase = getFirebase();
  if (!firebase || !uid) {
    setLiked(popId, false);
    return;
  }
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(firebase.db, "popStats", popId, "likes", uid));
  setLiked(popId, snap.exists());
}

export async function toggleLike(popId: string) {
  const firebase = getFirebase();
  const uid = firebase?.auth.currentUser?.uid;
  if (!firebase || !uid) {
    throw new Error("login");
  }
  const likeRef = doc(firebase.db, "popStats", popId, "likes", uid);
  const statsRef = doc(firebase.db, "popStats", popId);
  const nextLiked = await runTransaction(firebase.db, async (tx) => {
    const likeSnap = await tx.get(likeRef);
    const statsSnap = await tx.get(statsRef);
    const current = statsSnap.exists()
      ? Number(statsSnap.data().likeCount ?? 0)
      : (seedLikes[popId] ?? 0);
    const commentCount = statsSnap.exists()
      ? Number(statsSnap.data().commentCount ?? 0)
      : (seedComments[popId]?.length ?? 0);
    if (likeSnap.exists()) {
      tx.delete(likeRef);
      tx.set(statsRef, {
        likeCount: Math.max(0, current - 1),
        commentCount,
      }, { merge: true });
      return false;
    }
    tx.set(likeRef, { uid, createdAt: serverTimestamp() });
    tx.set(statsRef, {
      likeCount: current + 1,
      commentCount,
    }, { merge: true });
    return true;
  });
  setLiked(popId, nextLiked);
}

export function getComments(popId: string): SocialComment[] {
  return memory.comments[popId] ?? seedComments[popId] ?? [];
}

export async function addComment(popId: string, author: string, text: string) {
  const firebase = getFirebase();
  const user = firebase?.auth.currentUser;
  const trimmed = text.trim();
  if (!firebase || !user || !trimmed) {
    throw new Error("login");
  }
  const statsRef = doc(firebase.db, "popStats", popId);
  const commentRef = doc(collection(firebase.db, "popStats", popId, "comments"));
  await runTransaction(firebase.db, async (tx) => {
    const statsSnap = await tx.get(statsRef);
    const commentCount = statsSnap.exists()
      ? Number(statsSnap.data().commentCount ?? 0)
      : (seedComments[popId]?.length ?? 0);
    const likeCount = statsSnap.exists()
      ? Number(statsSnap.data().likeCount ?? 0)
      : (seedLikes[popId] ?? 0);
    tx.set(commentRef, {
      author,
      authorId: user.uid,
      text: trimmed.slice(0, 500),
      createdAt: serverTimestamp(),
    });
    tx.set(statsRef, {
      likeCount,
      commentCount: commentCount + 1,
    }, { merge: true });
  });
}

export function getMessages(withAuthor: string): SocialMessage[] {
  return memory.messages[withAuthor] ?? [];
}

export async function sendMessage(from: string, to: string, text: string) {
  const firebase = getFirebase();
  const user = firebase?.auth.currentUser;
  const trimmed = text.trim();
  if (!firebase || !user || !trimmed) {
    throw new Error("login");
  }
  await addDoc(collection(firebase.db, "messages"), {
    from,
    fromId: user.uid,
    to,
    text: trimmed.slice(0, 500),
    createdAt: serverTimestamp(),
  });
}

export async function reportPop(popTitle: string) {
  const firebase = getFirebase();
  const user = firebase?.auth.currentUser;
  if (!firebase || !user) {
    throw new Error("login");
  }
  await addDoc(collection(firebase.db, "reports"), {
    popTitle,
    fromId: user.uid,
    createdAt: serverTimestamp(),
  });
}
