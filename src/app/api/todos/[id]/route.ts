import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/db-client";
import { validateRequest } from "@/lib/validation";
import { updateTodoSchema } from "@/modules/todos/schemas/todo.schema";
import { checkRateLimit, apiLimiter } from "@/lib/rate-limiter";

// GET /api/todos/[id] - Get specific todo
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const todo = await DatabaseClient.getTodoById(params.id, session.user.id);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/[id] - Update todo
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(apiLimiter, session.user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Validate request
    const validation = await validateRequest(req, updateTodoSchema);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Update todo
    const todo = await DatabaseClient.updateTodo(
      params.id,
      session.user.id,
      validation.data
    );

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: session.user.id,
      action: "update",
      resource: "todo",
      resourceId: todo.id,
      details: `Updated todo via API: ${todo.title}`,
    });

    return NextResponse.json({
      success: true,
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(apiLimiter, session.user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Check if todo exists
    const existingTodo = await DatabaseClient.getTodoById(
      params.id,
      session.user.id
    );

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    // Delete todo
    await DatabaseClient.deleteTodo(params.id, session.user.id);

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: session.user.id,
      action: "delete",
      resource: "todo",
      resourceId: params.id,
      details: `Deleted todo via API: ${existingTodo.title}`,
    });

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}