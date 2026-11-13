"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TasksTable } from "@/components/tasks/tasks-table";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/lib/types";

export function TasksView() {
  const { data: tasks, isPending, error } = useTasks();

  // One dialog serves both cases: `editingTask` is set when editing and
  // undefined when creating.
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  function openCreateForm() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Create, track and complete your tasks.
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <PlusIcon data-icon="inline-start" />
          New task
        </Button>
      </div>

      {isPending && <p className="text-muted-foreground">Loading tasks...</p>}
      {error && <p className="text-destructive">{error.message}</p>}
      {tasks && <TasksTable tasks={tasks} onEdit={openEditForm} />}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
      />
    </section>
  );
}
