"use server";

import { revalidatePath } from "next/cache";
import { DatabaseClient } from "@/lib/db-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateTodoSchema, type UpdateTodoInput } from "../schemas/todo.schema";
import logger from "@/lib/logger";
import type { ApiResponse } from "@/types/api.types";
import type { Todo } from "@/db/schema";

export async function updateTodoAction(
  id: string,
  data: UpdateTodoInput
): Promise<ApiResponse<Todo>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate input
    const validated = updateTodoSchema.parse(data);

    // Check if todo exists and belongs to user
    const existingTodo = await DatabaseClient.getTodoById(id, session.user.id);

    if (!existingTodo) {
      return {
        success: false,
        error: "Todo not found",
      };
    }

    // Update todo
    const updatedData: any = { ...validated };

    // Handle status change to completed
    if (validated.status === "completed" && existingTodo.status !== "completed") {
      updatedData.completedAt = new Date();
    }

    const todo = await DatabaseClient.updateTodo(
      id,
      session.user.id,
      updatedData
    );

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: session.user.id,
      action: "update",
      resource: "todo",
      resourceId: todo.id,
      details: `Updated todo: ${todo.title}`,
    });

    logger.info({ userId: session.user.id, todoId: todo.id }, "Todo updated");

    // Revalidate todos page
    revalidatePath("/dashboard/todos");
    revalidatePath(`/dashboard/todos/${id}`);

    return {
      success: true,
      message: "Todo updated successfully",
      data: todo,
    };
  } catch (error: any) {
    logger.error({ error }, "Failed to update todo");

    if (error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Failed to update todo",
    };
  }
}