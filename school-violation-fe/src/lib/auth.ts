// Minimal stub for Auth.js server helper.
// Replace with real implementation when integrating authentication on the server.
export type ServerSession =
  | { user?: { access_token?: string } | Record<string, unknown> }
  | null;

export async function auth(): Promise<ServerSession> {
  return null;
}
