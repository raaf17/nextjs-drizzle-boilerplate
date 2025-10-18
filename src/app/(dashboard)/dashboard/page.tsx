import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DatabaseClient } from "@/lib/db-client";
import { StatsCard } from "@/modules/dashboard/components/stats-card";
import { RecentActivity } from "@/modules/dashboard/components/recent-activity";
import { CheckSquare, Clock, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const todos = await DatabaseClient.getTodosByUserId(session.user.id);

  const stats = {
    total: todos.length,
    pending: todos.filter((t) => t.status === "pending").length,
    inProgress: todos.filter((t) => t.status === "in_progress").length,
    completed: todos.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name || session.user.email}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          description="All your tasks"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="Tasks to start"
          trend="neutral"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          description="Active tasks"
          trend="positive"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          description="Finished tasks"
          trend="positive"
        />
      </div>

      <RecentActivity todos={todos.slice(0, 5)} />
    </div>
  );
}