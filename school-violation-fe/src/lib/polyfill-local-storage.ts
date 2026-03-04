// Polyfill localStorage for environments where it is missing or misconfigured
// (e.g., Bun on Windows without a valid --localstorage-file path).
(() => {
  const memoryStore = new Map<string, string>();

  const memoryStorage = {
    getItem: (key: string) =>
      memoryStore.has(key) ? memoryStore.get(key)! : null,
    setItem: (key: string, value: string) => {
      memoryStore.set(key, String(value));
    },
    removeItem: (key: string) => {
      memoryStore.delete(key);
    },
    clear: () => {
      memoryStore.clear();
    },
    key: (index: number) => Array.from(memoryStore.keys())[index] ?? null,
    get length() {
      return memoryStore.size;
    },
  } as Storage;

  const patchExistingObject = (target: Partial<Storage> | undefined | null) => {
    if (!target) return;
    const storage = target as Storage;
    storage.getItem =
      typeof storage.getItem === "function"
        ? storage.getItem.bind(storage)
        : memoryStorage.getItem.bind(memoryStorage);
    storage.setItem =
      typeof storage.setItem === "function"
        ? storage.setItem.bind(storage)
        : memoryStorage.setItem.bind(memoryStorage);
    storage.removeItem =
      typeof storage.removeItem === "function"
        ? storage.removeItem.bind(storage)
        : memoryStorage.removeItem.bind(memoryStorage);
    storage.clear =
      typeof storage.clear === "function"
        ? storage.clear.bind(storage)
        : memoryStorage.clear.bind(memoryStorage);
    if (!("key" in storage) || typeof storage.key !== "function") {
      storage.key = memoryStorage.key.bind(memoryStorage);
    }
    if (!("length" in storage)) {
      Object.defineProperty(storage, "length", {
        get: () => memoryStorage.length,
        configurable: true,
      });
    }
  };

  const assignMemoryStorage = () => {
    try {
      Object.defineProperty(globalThis, "localStorage", {
        value: memoryStorage,
        writable: true,
        configurable: true,
      });
    } catch {
      // ignore if reassignment is not allowed
    }
  };

  const isServer = typeof window === "undefined";

  if (isServer) {
    // On the server (Node/Bun), always use in-memory localStorage to avoid malformed impls.
    assignMemoryStorage();
    return;
  }

  // On the client, prefer existing localStorage if it has working funcs; otherwise patch/replace.
  try {
    if (typeof globalThis.localStorage === "object") {
      patchExistingObject(globalThis.localStorage as Storage);
    } else {
      assignMemoryStorage();
    }
  } catch {
    assignMemoryStorage();
  }

  try {
    patchExistingObject(
      (globalThis as { window?: { localStorage?: Storage } }).window?.localStorage
    );
  } catch {
    // ignore
  }
})();
