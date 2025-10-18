"use server";

import { revalidatePath } from "next/cache";
import { DatabaseClient } from "@/lib/db-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTodoSchema, type CreateTodoInput } from "../schemas/todo.schema";
import logger from "@/lib/logger";
import type { ApiResponse } from "@/types/api.types";
import type { Todo } from "@/db/schema";

export async function createTodoAction(
  data: CreateTodoInput
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
    const validated = createTodoSchema.parse(data);

    // Create todo
    const todo = await DatabaseClient.createTodo({
      userId: session.user.id,
      title: validated.title,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      dueDate: validated.dueDate,
    });

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: session.user.id,
      action: "create",
      resource: "todo",
      resourceId: todo.id,
      details: `Created todo: ${todo.title}`,
    });

    logger.info({ userId: session.user.id, todoId: todo.id }, "Todo created");

    // Revalidate todos page
    revalidatePath("/dashboard/todos");

    return {
      success: true,
      message: "Todo created successfully",
      data: todo,
    };
  } catch (error: any) {
    logger.error({ error }, "Failed to create todo");

    if (error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Failed to create todo",
    };
  }
}