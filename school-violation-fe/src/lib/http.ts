import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
});

// restore token dari localStorage kalau ada (sisi browser)
if (typeof window !== "undefined" &&
   typeof  window.localStorage?.getItem === "function") {
  try {
    const raw = window.localStorage.getItem("sv-auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token as string | undefined;
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error("Failed to restore auth token", err);
  }
}

export default api;
