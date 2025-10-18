import { db } from "@/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { users, todos, refreshTokens, auditLogs } from "@/db/schema";
import type { User, Todo, NewTodo, AuditLog } from "@/db/schema";

/**
 * Database client utilities dengan error handling
 */
export class DatabaseClient {
  // ========== USER OPERATIONS ==========
  
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return user || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database query failed");
    }
  }

  static async findUserById(id: string): Promise<User | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return user || null;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw new Error("Database query failed");
    }
  }

  static async createUser(data: {
    email: string;
    username: string;
    password: string;
    name?: string;
    role?: "admin" | "user";
  }): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          email: data.email,
          username: data.username,
          password: data.password,
          name: data.name,
          role: data.role || "user",
          updatedAt: new Date(),
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  static async updateUser(
    id: string,
    data: Partial<Pick<User, "name" | "email" | "isActive">>
  ): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  // ========== TODO OPERATIONS ==========
  
  static async getTodosByUserId(userId: string): Promise<Todo[]> {
    try {
      return await db
        .select()
        .from(todos)
        .where(eq(todos.userId, userId))
        .orderBy(desc(todos.createdAt));
    } catch (error) {
      console.error("Error getting todos:", error);
      throw new Error("Failed to fetch todos");
    }
  }

  static async getTodoById(id: string, userId: string): Promise<Todo | null> {
    try {
      const [todo] = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .limit(1);
      return todo || null;
    } catch (error) {
      console.error("Error getting todo:", error);
      throw new Error("Failed to fetch todo");
    }
  }

  static async createTodo(data: NewTodo): Promise<Todo> {
    try {
      const [todo] = await db
        .insert(todos)
        .values({
          ...data,
          updatedAt: new Date(),
        })
        .returning();
      return todo;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw new Error("Failed to create todo");
    }
  }

  static async updateTodo(
    id: string,
    userId: string,
    data: Partial<NewTodo>
  ): Promise<Todo> {
    try {
      const [todo] = await db
        .update(todos)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .returning();
      return todo;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw new Error("Failed to update todo");
    }
  }

  static async deleteTodo(id: string, userId: string): Promise<void> {
    try {
      await db
        .delete(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw new Error("Failed to delete todo");
    }
  }

  // ========== REFRESH TOKEN OPERATIONS ==========
  
  static async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    try {
      const [refreshToken] = await db
        .insert(refreshTokens)
        .values({ userId, token, expiresAt })
        .returning();
      return refreshToken;
    } catch (error) {
      console.error("Error creating refresh token:", error);
      throw new Error("Failed to create refresh token");
    }
  }

  static async findRefreshToken(token: string) {
    try {
      const [refreshToken] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token))
        .limit(1);
      return refreshToken || null;
    } catch (error) {
      console.error("Error finding refresh token:", error);
      throw new Error("Failed to find refresh token");
    }
  }

  static async deleteRefreshToken(token: string): Promise<void> {
    try {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    } catch (error) {
      console.error("Error deleting refresh token:", error);
      throw new Error("Failed to delete refresh token");
    }
  }

  static async deleteUserRefreshTokens(userId: string): Promise<void> {
    try {
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    } catch (error) {
      console.error("Error deleting user refresh tokens:", error);
      throw new Error("Failed to delete user refresh tokens");
    }
  }

  // ========== AUDIT LOG OPERATIONS ==========
  
  static async createAuditLog(data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await db.insert(auditLogs).values(data);
    } catch (error) {
      console.error("Error creating audit log:", error);
      // Don't throw error for audit logs to avoid breaking main flow
    }
  }

  static async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    try {
      return await db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit);
    } catch (error) {
      console.error("Error getting audit logs:", error);
      throw new Error("Failed to fetch audit logs");
    }
  }
}