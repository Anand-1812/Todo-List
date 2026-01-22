import type { Route } from "./+types/Dashboard";
import { requireUserSession } from "~/utils/auth.router";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUserSession(request);
  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const userName = loaderData?.user?.name || "Guest";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Welcome, {userName}!</h1>
    </div>
  );
}
