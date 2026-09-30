"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getFirebase, isFirebaseConfigured } from "@/lib/firebase";
import { AUTHOR_MAX_LENGTH, startPopsListener } from "@/lib/user-pops";
import { clearBookmarks, startBookmarksListener, startSocialListener } from "@/lib/social";
import { startProfilesListener } from "@/lib/profiles";

export type AuthProfile = {
  uid: string;
  email: string;
  name: string;
  instagram: string;
  x: string;
  prefecture: string;
  storeUrl: string;
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  profile: AuthProfile | null;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updatePublicProfile: (input: {
    instagram: string;
    x: string;
    prefecture: string;
    storeUrl: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function authErrorMessage(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "このメールアドレスはすでに登録されています";
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません";
    case "auth/weak-password":
      return "パスワードは6文字以上にしてください";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "メールアドレスまたはパスワードが違います";
    case "auth/too-many-requests":
      return "少し時間をおいてから再度お試しください";
    default:
      return "処理に失敗しました。時間をおいて再度お試しください";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const stopPops = startPopsListener();
    const stopSocial = startSocialListener();
    const stopProfiles = startProfilesListener();
    if (!configured) {
      setLoading(false);
      return () => {
        stopPops();
        stopSocial();
        stopProfiles();
      };
    }
    const firebase = getFirebase();
    if (!firebase) {
      setLoading(false);
      return () => {
        stopPops();
        stopSocial();
        stopProfiles();
      };
    }
    let stopBookmarks = () => {};
    const unsub = onAuthStateChanged(firebase.auth, async (next) => {
      stopBookmarks();
      stopBookmarks = () => {};
      setUser(next);
      if (!next) {
        clearBookmarks();
        setProfile(null);
        setLoading(false);
        return;
      }
      stopBookmarks = startBookmarksListener(next.uid);
      const snap = await getDoc(doc(firebase.db, "users", next.uid));
      const data = snap.exists() ? snap.data() : {};
      const name =
        String(data.name ?? "") || next.displayName || "ゲスト";
      if (!snap.exists()) {
        await setDoc(doc(firebase.db, "users", next.uid), {
          name: name.slice(0, AUTHOR_MAX_LENGTH),
          email: next.email ?? "",
          createdAt: serverTimestamp(),
        });
      }
      setProfile({
        uid: next.uid,
        email: next.email ?? "",
        name: name.slice(0, AUTHOR_MAX_LENGTH),
        instagram: String(data.instagram ?? ""),
        x: String(data.x ?? ""),
        prefecture: String(data.prefecture ?? ""),
        storeUrl: String(data.storeUrl ?? ""),
      });
      setLoading(false);
    });
    return () => {
      unsub();
      stopBookmarks();
      stopPops();
      stopSocial();
      stopProfiles();
    };
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      loading: !hydrated || loading,
      user,
      profile,
      async register(email, password, name) {
        const firebase = getFirebase();
        if (!firebase) throw new Error("not-configured");
        const trimmed = name.trim().slice(0, AUTHOR_MAX_LENGTH);
        if (!trimmed) throw new Error("name");
        const cred = await createUserWithEmailAndPassword(
          firebase.auth,
          email.trim(),
          password,
        );
        await updateProfile(cred.user, { displayName: trimmed });
        await setDoc(doc(firebase.db, "users", cred.user.uid), {
          name: trimmed,
          email: cred.user.email ?? email.trim(),
          instagram: "",
          x: "",
          prefecture: "",
          storeUrl: "",
          createdAt: serverTimestamp(),
        });
      },
      async login(email, password) {
        const firebase = getFirebase();
        if (!firebase) throw new Error("not-configured");
        await signInWithEmailAndPassword(firebase.auth, email.trim(), password);
      },
      async logout() {
        const firebase = getFirebase();
        if (!firebase) return;
        await signOut(firebase.auth);
      },
      async resetPassword(email) {
        const firebase = getFirebase();
        if (!firebase) throw new Error("not-configured");
        await sendPasswordResetEmail(firebase.auth, email.trim());
      },
      async updateName(name) {
        const firebase = getFirebase();
        const current = firebase?.auth.currentUser;
        if (!firebase || !current) throw new Error("not-configured");
        const trimmed = name.trim().slice(0, AUTHOR_MAX_LENGTH);
        if (!trimmed) throw new Error("name");
        await updateProfile(current, { displayName: trimmed });
        await updateDoc(doc(firebase.db, "users", current.uid), { name: trimmed });
        setProfile((prev) => (prev ? { ...prev, name: trimmed } : prev));
      },
      async updatePublicProfile(input) {
        const firebase = getFirebase();
        const current = firebase?.auth.currentUser;
        if (!firebase || !current) throw new Error("not-configured");
        const next = {
          instagram: input.instagram.trim().slice(0, 80),
          x: input.x.trim().slice(0, 80),
          prefecture: input.prefecture.trim().slice(0, 8),
          storeUrl: input.storeUrl.trim().slice(0, 200),
        };
        await updateDoc(doc(firebase.db, "users", current.uid), next);
        setProfile((prev) => (prev ? { ...prev, ...next } : prev));
      },
    }),
    [configured, hydrated, loading, user, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth");
  }
  return value;
}
