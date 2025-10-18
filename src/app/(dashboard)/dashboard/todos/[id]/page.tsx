import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/db-client";
import { notFound } from "next/navigation";
import { TodoForm } from "@/modules/todos/components/todo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditTodoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const todo = await DatabaseClient.getTodoById(params.id, session.user.id);

  if (!todo) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/todos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
          <p className="text-muted-foreground">Update your task details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm todo={todo} />
        </CardContent>
      </Card>
    </div>
  );
}