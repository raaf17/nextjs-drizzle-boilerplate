"use server";

import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { DatabaseClient } from "@/lib/db-client";
import { PasswordUtil } from "../utils/password.util";
import logger from "@/lib/logger";
import type { ApiResponse } from "@/types/api.types";

export async function registerAction(
  data: RegisterInput
): Promise<ApiResponse> {
  try {
    // Validate input
    const validated = registerSchema.parse(data);

    // Check if email already exists
    const existingUser = await DatabaseClient.findUserByEmail(validated.email);
    if (existingUser) {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(validated.password);

    // Create user
    const user = await DatabaseClient.createUser({
      email: validated.email,
      username: validated.username,
      password: hashedPassword,
      name: validated.name,
      role: "user",
    });

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: user.id,
      action: "register",
      resource: "auth",
      details: "New user registered",
    });

    logger.info({ userId: user.id }, "User registered successfully");

    return {
      success: true,
      message: "Registration successful! Please login.",
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  } catch (error: any) {
    logger.error({ error }, "Registration failed");
    
    if (error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Registration failed. Please try again.",
    };
  }
}