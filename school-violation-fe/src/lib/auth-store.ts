import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "@/lib/http";

export type UserRole = "ADMIN" | "BK" | "GURU";

type AuthState = {
  token: string | null;
  username: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;

  // NEW: tahu kapan storage sudah ke-load
  hasHydrated: boolean;

  login: (payload: { token: string; username: string; role: UserRole }) => void;
  logout: () => void;

  // NEW: internal setter
  setHasHydrated: (value: boolean) => void;
};

const authStoreCreator: StateCreator<AuthState> = (set) => ({
  token: null,
  username: null,
  role: null,
  isAuthenticated: false,
  hasHydrated: false,

  login: ({ token, username, role }) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    set({
      token,
      username,
      role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    delete api.defaults.headers.common["Authorization"];
    set({
      token: null,
      username: null,
      role: null,
      isAuthenticated: false,
    });
  },

  setHasHydrated: (value) => set({ hasHydrated: value }),
});

const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>();

  return {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

const isUsableStorage = (candidate: unknown): candidate is Storage => {
  const storage = candidate as Storage | undefined;
  return (
    !!storage &&
    typeof storage.getItem === "function" &&
    typeof storage.setItem === "function" &&
    typeof storage.removeItem === "function"
  );
};

const memoryStorage = createMemoryStorage();

const safeStorage = createJSONStorage<AuthState>(() => {
  // prefer browser localStorage when it is available and well-formed
  if (typeof window !== "undefined" && isUsableStorage(window.localStorage)) {
    return window.localStorage;
  }

  // fall back to any global polyfill that might have been set up server-side
  if (
    typeof globalThis.localStorage !== "undefined" &&
    isUsableStorage(globalThis.localStorage as Storage)
  ) {
    return globalThis.localStorage as Storage;
  }

  // last resort: in-memory storage to avoid crashes during SSR/dev server
  return memoryStorage;
});

export const useAuthStore = create<AuthState>()(
  persist(authStoreCreator, {
    name: "sv-auth",
    storage: safeStorage,
    // ini dipanggil setelah data dari localStorage di-load
    onRehydrateStorage: () => (state) => {
      if (!state) return;

      // kalau masih ada token tersimpan, set ulang header axios
      if (state.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      }

      // tandai bahwa hydrate sudah selesai
      state.setHasHydrated(true);
    },
  })
);
