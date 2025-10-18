import { z } from "zod";

export const todoStatusEnum = z.enum(["pending", "in_progress", "completed"]);
export const todoPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  status: todoStatusEnum.default("pending"),
  priority: todoPriorityEnum.default("medium"),
  dueDate: z.coerce.date().optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

export const todoQuerySchema = z.object({
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "dueDate", "title", "priority"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;