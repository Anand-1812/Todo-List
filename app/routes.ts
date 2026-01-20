import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "auth/Signup.tsx"),
  route("login", "auth/Login.tsx"),
  route("dashboard", "Dashboard/Dashboard.tsx"),
] satisfies RouteConfig;
