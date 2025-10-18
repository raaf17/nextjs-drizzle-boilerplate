export const PUBLIC_ROUTES = ["/", "/login", "/register", "/api/health"];

export const AUTH_ROUTES = ["/login", "/register"];

export const PROTECTED_ROUTES = ["/dashboard"];

export const ADMIN_ROUTES = ["/dashboard/users"];

export const API_AUTH_PREFIX = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  TODOS: "/dashboard/todos",
  SETTINGS: "/dashboard/settings",
  USERS: "/dashboard/users",
} as const;