import type { Route } from "./+types/Dashboard";
import { requireUserSession } from "~/utils/auth.router";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUserSession(request);
  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-8 text-white">
      <h1>Welcome back, {loaderData.user.name}!</h1>
    </div>
  );
}
