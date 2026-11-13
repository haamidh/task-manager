"use client";

import { CircleAlertIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TasksTable } from "@/components/tasks/tasks-table";
import {
  SORT_OPTIONS,
  TasksToolbar,
  type SortOption,
  type StatusFilter,
} from "@/components/tasks/tasks-toolbar";
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sort, setSort] = useState<SortOption>("newest");

  // Filtering and sorting happen in the API, so the choices are sent as
  // query params and the list is refetched when they change.
  const {
    data: tasks,
    isPending,
    isFetching,
    error,
    refetch,
  } = useTasks({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    ...SORT_OPTIONS[sort].params,
  });

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

      <TasksToolbar
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sort={sort}
        onSortChange={setSort}
      />

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
          emptyMessage={
            statusFilter === "ALL"
              ? "No tasks yet. Create your first one with “New task”."
              : "No tasks with this status."
          }
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
