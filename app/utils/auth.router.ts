import { redirect } from "react-router";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${VITE_API_URL}/api`;

export async function requireUserSession(request: Request) {
  // If in browser context, use credentials: "include" for automatic cookie handling
  if (typeof document !== "undefined") {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  }

  // If in server context, manually pass cookies in headers
  const cookie = request.headers.get("cookie");
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Cookie: cookie || "" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function requireAuth(request: Request) {
  const user = await requireUserSession(request);
  if (!user) throw redirect("/login");
  return user;
}

export async function getUserNotes(request: Request) {
  const isBrowser = typeof document !== "undefined";
  const options: RequestInit = {
    credentials: isBrowser ? "include" : "omit",
    headers: isBrowser ? {} : { Cookie: request.headers.get("cookie") || "" },
  };

  try {
    const res = await fetch(`${API_BASE}/notes`, options);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function getArchivedNotes(request: Request) {
  const isBrowser = typeof document !== "undefined";
  const options: RequestInit = {
    credentials: isBrowser ? "include" : "omit",
    headers: isBrowser ? {} : { Cookie: request.headers.get("cookie") || "" },
  };

  try {
    const res = await fetch(`${API_BASE}/notes/archived`, options);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching archived notes:", error);
    return [];
  }
}
