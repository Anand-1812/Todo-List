import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./tailwind.css?url";
import Navbar from "components/Navbar";
import AuthContext from "Context/Context";
import { requireUserSession } from "./utils/auth.router";
import { Toaster } from "sonner";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// ✅ Keep clientLoader for browser-side auth
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUserSession(request);
  return { user };
}

// ✅ ADDED: HydrateFallback prevents the UI from flickering/crashing while clientLoader runs
export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-950 text-neutral-100">
        {/* Simple loading state */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  // ✅ FIX: Safely access data. During Server Render, 'data' will be undefined.
  const data = useLoaderData<typeof clientLoader>();
  const user = data?.user;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-950 text-neutral-100 antialiased selection:bg-white selection:text-black selection:rounded-3xl">
        {/* Pass 'user' safely. If undefined, Context should handle it (or passed as null) */}
        <AuthContext.Provider value={user as any}>
          <Navbar />

          <div className="min-h-screen">{children}</div>

          <Toaster
            duration={2000}
            position="top-right"
            theme="dark"
            toastOptions={{
              unstyled: true,
              classNames: {
                toast: `flex items-center gap-3 w-full max-w-sm p-4 bg-neutral-900/60
                  backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl transition-all duration-300
                `,
                title: "text-sm font-semibold text-white",
                description: "text-xs text-neutral-400",
                success: "border-emerald-500/20 text-emerald-400",
                error: "border-red-500/20 text-red-400",
                info: "border-sky-500/20 text-sky-400",
              },
            }}
          />

          <ScrollRestoration />
          <Scripts />
        </AuthContext.Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-950 text-white">
        <main className="pt-32 p-8 max-w-xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-4">{message}</h1>
          <p className="text-neutral-500 text-lg mb-8">{details}</p>
          {stack && (
            <pre className="w-full p-6 bg-neutral-900 border border-white/5 rounded-2xl overflow-x-auto text-left text-xs text-neutral-400">
              <code>{stack}</code>
            </pre>
          )}
        </main>
        <Scripts />
      </body>
    </html>
  );
}
