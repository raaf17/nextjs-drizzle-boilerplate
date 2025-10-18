export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    "users:read",
    "users:write",
    "users:delete",
    "todos:read",
    "todos:write",
    "todos:delete",
    "settings:read",
    "settings:write",
  ],
  [UserRole.USER]: [
    "todos:read",
    "todos:write",
    "todos:delete",
    "settings:read",
  ],
} as const;

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role as UserRole];
  return permissions?.includes(permission as any) ?? false;
}

export function isAdmin(role: string): boolean {
  return role === UserRole.ADMIN;
}