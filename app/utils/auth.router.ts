import { redirect } from "react-router";

// Standardize the API base path to prevent // double slashes
const VITE_API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const API_BASE = `${VITE_API_URL}/api`;

export async function requireUserSession(request: Request) {
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

export async function requireAuth(request: Request) {
  const user = await requireUserSession(request);
  if (!user) throw redirect("/login");
  return user;
}

export async function getUserNotes(request: Request) {
  const cookie = request.headers.get("cookie");
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      headers: { Cookie: cookie || "" },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function getArchivedNotes(request: Request) {
  const cookie = request.headers.get("cookie");
  try {
    const res = await fetch(`${API_BASE}/notes/archived`, {
      headers: { Cookie: cookie || "" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching archived notes:", error);
    return [];
  }
}
