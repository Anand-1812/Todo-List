import { redirect } from "react-router";

export async function requireUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");

  try {
    const res = await fetch("http://localhost:3001/api/auth/me", {
      headers: {
        Cookie: cookie || "",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (error: any) {
    return null;
  }
}

export async function requireAuth(request: Request) {
  const user = await requireUserSession(request);
  if (!user) {
    throw redirect("/login");
  }
  return { user };
}
