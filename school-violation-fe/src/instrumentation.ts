// Run as early as possible on the server to ensure localStorage is safe during SSR/dev.
import "@/lib/polyfill-local-storage";

export async function register() {
  // No-op: import side-effect above applies the polyfill.
}
