"use client";

import { TasksTable } from "@/components/tasks/tasks-table";
import { useTasks } from "@/hooks/use-tasks";

export function TasksView() {
  const { data: tasks, isPending, error } = useTasks();

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Create, track and complete your tasks.
        </p>
      </div>

      {isPending && <p className="text-muted-foreground">Loading tasks...</p>}
      {error && <p className="text-destructive">{error.message}</p>}
      {tasks && <TasksTable tasks={tasks} />}
    </section>
  );
}
