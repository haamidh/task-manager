"use client";

import { CircleAlertIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TasksTable } from "@/components/tasks/tasks-table";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/lib/types";

export function TasksView() {
  const { data: tasks, isPending, isFetching, error, refetch } = useTasks();

  // One dialog serves both cases: `editingTask` is set when editing and
  // undefined when creating.
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | undefined>();

  function openCreateForm() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function openDeleteConfirmation(task: Task) {
    setDeletingTask(task);
    setDeleteOpen(true);
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

      {error ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Could not load tasks</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <AlertAction>
            <Button
              variant="outline"
              size="sm"
              disabled={isFetching}
              onClick={() => refetch()}
            >
              {isFetching ? "Retrying..." : "Retry"}
            </Button>
          </AlertAction>
        </Alert>
      ) : (
        <TasksTable
          tasks={tasks ?? []}
          isLoading={isPending}
          onEdit={openEditForm}
          onDelete={openDeleteConfirmation}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
      />
      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        task={deletingTask}
      />
    </section>
  );
}
