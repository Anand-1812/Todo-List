import { redirect } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL;

// Validates the session and returns the user object if authenticated.
export async function requireUserSession(request: Request) {
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

// Protects routes by redirecting unauthenticated users to /login.

export async function requireAuth(request: Request) {
  const user = await requireUserSession(request);
  if (!user) throw redirect("/login");
  return user;
}

// Fetches active notes for the dashboard.
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

// Fetches only the archived notes for the Vault page.

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
