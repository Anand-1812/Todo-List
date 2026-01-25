import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "auth/Signup.tsx"),
  route("login", "auth/Login.tsx"),
  route("dashboard", "Dashboard/Dashboard.tsx"),
  route("settings", "Settings/Settings.tsx"),
  route("archives", "Archive/Archive.tsx"),
  route("docs", "Docs/Docs.tsx"),
] satisfies RouteConfig;
