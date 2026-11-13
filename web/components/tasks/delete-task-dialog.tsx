"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTask } from "@/hooks/use-tasks";
import type { Task } from "@/lib/types";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The task the user asked to delete. */
  task?: Task;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  task,
}: DeleteTaskDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {task && (
          <DeleteTaskConfirmation
            task={task}
            onDone={() => onOpenChange(false)}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Kept as its own component so the mutation state (pending, error) starts
// fresh each time the dialog opens.
function DeleteTaskConfirmation({
  task,
  onDone,
}: {
  task: Task;
  onDone: () => void;
}) {
  const deleteTask = useDeleteTask();

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this task?</AlertDialogTitle>
        <AlertDialogDescription>
          <span className="font-medium text-foreground">
            &ldquo;{task.title}&rdquo;
          </span>{" "}
          will be permanently deleted. This cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>

      {deleteTask.error && (
        <p role="alert" className="text-sm text-destructive">
          {deleteTask.error.message}
        </p>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel disabled={deleteTask.isPending}>
          Cancel
        </AlertDialogCancel>
        {/* The dialog only closes once the API confirms the delete. */}
        <AlertDialogAction
          variant="destructive"
          disabled={deleteTask.isPending}
          onClick={() => deleteTask.mutate(task.id, { onSuccess: onDone })}
        >
          {deleteTask.isPending ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
