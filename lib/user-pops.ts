import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { dummyPops, type Pop } from "@/lib/dummy-pops";
import { getFirebase } from "@/lib/firebase";
import { fileToJpegBlob } from "@/lib/post-fields";

const POPS_EVENT = "dpop-pops";

export const AUTHOR_MAX_LENGTH = 20;

let remotePops: Pop[] = [];
let popsVersion = 0;

function emitPopsChange() {
  popsVersion += 1;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(POPS_EVENT));
  }
}

export function subscribePops(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(POPS_EVENT, onChange);
  return () => window.removeEventListener(POPS_EVENT, onChange);
}

export function getPopsVersion() {
  return popsVersion;
}

function docToPop(id: string, data: Record<string, unknown>): Pop {
  return {
    id,
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? ""),
    authorId: data.authorId ? String(data.authorId) : undefined,
    image: String(data.image ?? ""),
    storagePath: data.storagePath ? String(data.storagePath) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
  };
}

export function startPopsListener() {
  const firebase = getFirebase();
  if (!firebase || typeof window === "undefined") return () => {};
  return onSnapshot(
    query(collection(firebase.db, "pops"), orderBy("createdAt", "desc")),
    (snap) => {
      remotePops = snap.docs.map((item) =>
        docToPop(item.id, item.data() as Record<string, unknown>),
      );
      emitPopsChange();
    },
  );
}

export function listAllPops(): Pop[] {
  const ids = new Set(remotePops.map((pop) => pop.id));
  return [...remotePops, ...dummyPops.filter((pop) => !ids.has(pop.id))];
}

export function readUserPops(): Pop[] {
  return remotePops;
}

export async function saveUserPop(input: {
  title: string;
  date: string;
  author: string;
  authorId: string;
  tags: string[];
  file: File;
}) {
  const firebase = getFirebase();
  if (!firebase) throw new Error("not-configured");
  const id = `p${Date.now()}`;
  const storagePath = `pops/${input.authorId}/${id}.jpg`;
  const blob = await fileToJpegBlob(input.file);
  const fileRef = ref(firebase.storage, storagePath);
  await uploadBytes(fileRef, blob, { contentType: "image/jpeg" });
  const image = await getDownloadURL(fileRef);
  const pop: Pop = {
    id,
    title: input.title,
    date: input.date,
    author: input.author,
    authorId: input.authorId,
    image,
    storagePath,
    tags: input.tags,
    createdAt: Date.now(),
  };
  await setDoc(doc(firebase.db, "pops", id), pop);
  return pop;
}

export async function updatePop(
  current: Pop,
  patch: {
    title: string;
    date: string;
    tags: string[];
    file?: File;
  },
) {
  const firebase = getFirebase();
  if (!firebase || !current.authorId) throw new Error("not-configured");
  let image = current.image;
  let storagePath = current.storagePath;
  if (patch.file) {
    storagePath = `pops/${current.authorId}/${current.id}.jpg`;
    const blob = await fileToJpegBlob(patch.file);
    const fileRef = ref(firebase.storage, storagePath);
    await uploadBytes(fileRef, blob, { contentType: "image/jpeg" });
    image = await getDownloadURL(fileRef);
  }
  await updateDoc(doc(firebase.db, "pops", current.id), {
    title: patch.title,
    date: patch.date,
    tags: patch.tags,
    image,
    storagePath,
    updatedAt: Date.now(),
  });
}

export function canEditPop(pop: Pop, uid: string | undefined) {
  return Boolean(uid && pop.authorId && pop.authorId === uid);
}
