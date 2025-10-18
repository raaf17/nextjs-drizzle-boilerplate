import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { Todo } from "@/db/schema";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface RecentActivityProps {
  todos: Todo[];
}

export function RecentActivity({ todos }: RecentActivityProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: "default",
      in_progress: "secondary",
      pending: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {todos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(todo.status)}
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {todo.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(todo.createdAt)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(todo.status)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}