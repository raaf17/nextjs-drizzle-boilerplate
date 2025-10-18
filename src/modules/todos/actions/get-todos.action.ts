"use server";

import { DatabaseClient } from "@/lib/db-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ApiResponse } from "@/types/api.types";
import type { Todo } from "@/db/schema";

export async function getTodosAction(): Promise<ApiResponse<Todo[]>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const todos = await DatabaseClient.getTodosByUserId(session.user.id);

    return {
      success: true,
      data: todos,
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Failed to fetch todos",
    };
  }
}