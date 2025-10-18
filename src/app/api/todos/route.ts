import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/db-client";
import { validateRequest } from "@/lib/validation";
import { createTodoSchema } from "@/modules/todos/schemas/todo.schema";
import { checkRateLimit, apiLimiter } from "@/lib/rate-limiter";

// GET /api/todos - Get all todos for authenticated user
export async function GET(req: NextRequest) {
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

    const todos = await DatabaseClient.getTodosByUserId(session.user.id);

    return NextResponse.json({
      success: true,
      data: todos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create new todo
export async function POST(req: NextRequest) {
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
    const validation = await validateRequest(req, createTodoSchema);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Create todo
    const todo = await DatabaseClient.createTodo({
      userId: session.user.id,
      ...validation.data,
    });

    // Log audit
    await DatabaseClient.createAuditLog({
      userId: session.user.id,
      action: "create",
      resource: "todo",
      resourceId: todo.id,
      details: `Created todo via API: ${todo.title}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Todo created successfully",
        data: todo,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create todo" },
      { status: 500 }
    );
  }
}