import { collection, onSnapshot } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";

export type PublicProfile = {
  uid: string;
  name: string;
  instagram: string;
  x: string;
  prefecture: string;
  storeUrl: string;
};

const EVENT = "dpop-profiles";
let profiles: PublicProfile[] = [];
let version = 0;

function bump() {
  version += 1;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

export function subscribeProfiles(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function getProfilesVersion() {
  return version;
}

export function startProfilesListener() {
  const firebase = getFirebase();
  if (!firebase || typeof window === "undefined") return () => {};
  return onSnapshot(
    collection(firebase.db, "users"),
    (snap) => {
      profiles = snap.docs.map((item) => {
        const data = item.data();
        return {
          uid: item.id,
          name: String(data.name ?? ""),
          instagram: String(data.instagram ?? ""),
          x: String(data.x ?? ""),
          prefecture: String(data.prefecture ?? ""),
          storeUrl: String(data.storeUrl ?? ""),
        };
      });
      bump();
    },
    () => {},
  );
}

export function findProfileByUid(uid: string | undefined) {
  if (!uid) return undefined;
  return profiles.find((item) => item.uid === uid);
}

export function findProfileByName(name: string) {
  return profiles.find((item) => item.name === name);
}
