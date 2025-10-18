"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTodoAction } from "../actions/delete-todo.action";
import { updateTodoAction } from "../actions/update-todo.action";
import type { Todo } from "@/db/schema";
import { Pencil, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTodoAction(todo.id);
      if (result.success) {
        toast.success("Task deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const newStatus =
        todo.status === "completed"
          ? "pending"
          : todo.status === "pending"
          ? "in_progress"
          : "completed";

      const result = await updateTodoAction(todo.id, { status: newStatus });
      if (result.success) {
        toast.success("Status updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = () => {
    switch (todo.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (todo.status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleStatus}
            disabled={isUpdating}
          >
            {getStatusIcon()}
          </Button>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/todos/${todo.id}`}
                className="font-medium hover:underline"
              >
                {todo.title}
              </Link>
              <Badge variant={getStatusColor() as any}>
                {todo.status.replace("_", " ")}
              </Badge>
              <Badge variant={getPriorityColor() as any}>
                {todo.priority}
              </Badge>
            </div>

            {todo.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Created: {formatDate(todo.createdAt)}</span>
              {todo.dueDate && (
                <span>Due: {formatDate(todo.dueDate)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/todos/${todo.id}`}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}