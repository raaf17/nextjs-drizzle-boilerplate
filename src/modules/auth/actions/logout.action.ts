"use server";

import { signOut } from "next-auth/react";
import { DatabaseClient } from "@/lib/db-client";
import logger from "@/lib/logger";

export async function logoutAction(userId: string): Promise<void> {
  try {
    // Delete all refresh tokens
    await DatabaseClient.deleteUserRefreshTokens(userId);

    // Log audit
    await DatabaseClient.createAuditLog({
      userId,
      action: "logout",
      resource: "auth",
      details: "User logged out",
    });

    logger.info({ userId }, "User logged out");
  } catch (error) {
    logger.error({ error, userId }, "Logout failed");
  }
}