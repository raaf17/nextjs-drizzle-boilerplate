"use server";

import { revalidatePath } from "next/cache";
import { DatabaseClient } from "@/lib/db-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import logger from "@/lib/logger";
import type { ApiResponse } from "@/types/api.types";

export async function deleteTodoAction(id: string): Promise<ApiResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check if todo exists and belongs to user
    const existingTodo = await DatabaseClient.getTodoById(id, session.user.id);

    if (!existingTodo) {
      return {
        success: false,
        error: "Todo not found",
      };
    }

    // Delete todo
    await DatabaseClient.deleteTodo(id, session.user.id);

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: session.user.id,
      action: "delete",
      resource: "todo",
      resourceId: id,
      details: `Deleted todo: ${existingTodo.title}`,
    });

    logger.info({ userId: session.user.id, todoId: id }, "Todo deleted");

    // Revalidate todos page
    revalidatePath("/dashboard/todos");

    return {
      success: true,
      message: "Todo deleted successfully",
    };
  } catch (error: any) {
    logger.error({ error }, "Failed to delete todo");

    return {
      success: false,
      error: "Failed to delete todo",
    };
  }
}