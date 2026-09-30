import { dummyPops, SAMPLE_AUTHOR, type Pop } from "@/lib/dummy-pops";

const STORAGE_KEY = "dpop-user-posts";
const AUTHOR_KEY = "dpop-author";
const OVERRIDES_KEY = "dpop-pop-overrides";
const POPS_EVENT = "dpop-pops";

export const AUTHOR_MAX_LENGTH = 20;

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

function readRawUserPops(): Pop[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Pop[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readOverrides(): Record<string, Partial<Pop>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<Pop>>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function applyOverrides(pop: Pop): Pop {
  return { ...pop, ...readOverrides()[pop.id] };
}

export function readUserPops(): Pop[] {
  return readRawUserPops().map(applyOverrides);
}

export function listAllPops(): Pop[] {
  const users = readUserPops();
  const userIds = new Set(users.map((pop) => pop.id));
  const samples = dummyPops
    .filter((pop) => !userIds.has(pop.id))
    .map(applyOverrides);
  return [...users, ...samples];
}

export function saveUserPop(pop: Pop) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([pop, ...readRawUserPops()]),
  );
  emitPopsChange();
}

export function updatePop(
  id: string,
  patch: Pick<Pop, "title" | "date" | "image" | "tags">,
) {
  const users = readRawUserPops();
  const index = users.findIndex((pop) => pop.id === id);
  if (index >= 0) {
    users[index] = { ...users[index], ...patch };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    emitPopsChange();
    return;
  }
  const overrides = readOverrides();
  overrides[id] = { ...overrides[id], ...patch };
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  emitPopsChange();
}

export function readAuthorName(): string {
  if (typeof window === "undefined") return "";
  const saved = window.localStorage.getItem(AUTHOR_KEY)?.trim() ?? "";
  if (!saved || saved.startsWith("ゲスト")) {
    window.localStorage.setItem(AUTHOR_KEY, SAMPLE_AUTHOR);
    return SAMPLE_AUTHOR;
  }
  return saved.slice(0, AUTHOR_MAX_LENGTH);
}

export function saveAuthorName(name: string) {
  window.localStorage.setItem(
    AUTHOR_KEY,
    name.trim().slice(0, AUTHOR_MAX_LENGTH),
  );
}
