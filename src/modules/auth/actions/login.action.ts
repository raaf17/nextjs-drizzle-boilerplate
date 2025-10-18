"use server";

import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { DatabaseClient } from "@/lib/db-client";
import { PasswordUtil } from "../utils/password.util";
import { checkRateLimit, loginLimiter } from "@/lib/rate-limiter";
import logger from "@/lib/logger";
import type { ApiResponse } from "@/types/api.types";

export async function loginAction(data: LoginInput): Promise<ApiResponse> {
  try {
    // Validate input
    const validated = loginSchema.parse(data);

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      loginLimiter,
      validated.email
    );

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: rateLimitResult.error,
      };
    }

    // Find user
    const user = await DatabaseClient.findUserByEmail(validated.email);

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is disabled. Please contact support.",
      };
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.verify(
      validated.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: user.id,
      action: "login",
      resource: "auth",
      details: "User logged in successfully",
    });

    logger.info({ userId: user.id }, "User logged in");

    return {
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error: any) {
    logger.error({ error }, "Login failed");

    return {
      success: false,
      error: "Login failed. Please try again.",
    };
  }
}