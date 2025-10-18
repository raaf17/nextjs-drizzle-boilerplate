import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/db-client";
import { TodoList } from "@/modules/todos/components/todo-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TodosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const todos = await DatabaseClient.getTodosByUserId(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <Link href="/dashboard/todos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <TodoList initialTodos={todos} />
    </div>
  );
}