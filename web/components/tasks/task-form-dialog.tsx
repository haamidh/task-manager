"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { STATUS_LABELS } from "@/components/tasks/task-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { taskFormSchema, type TaskFormValues } from "@/lib/schemas";
import { TASK_STATUSES, type Task } from "@/lib/types";

const STATUS_OPTIONS = TASK_STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The task to edit. Leave undefined to create a new task. */
  task?: Task;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details of this task."
              : "Add a task to your list."}
          </DialogDescription>
        </DialogHeader>
        {/* The dialog content unmounts when closed, so the form always
            starts fresh with the right default values when it opens. */}
        <TaskForm task={task} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({ task, onDone }: { task?: Task; onDone: () => void }) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const mutation = task ? updateTask : createTask;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      // The API returns a full ISO timestamp; the date input wants YYYY-MM-DD.
      dueDate: task?.dueDate?.slice(0, 10) ?? "",
    },
  });
  const { errors } = form.formState;

  function onSubmit(values: TaskFormValues) {
    // Empty optional fields are sent as null so that editing can clear them.
    const input = {
      title: values.title,
      description: values.description || null,
      status: values.status,
      dueDate: values.dueDate || null,
    };

    if (task) {
      updateTask.mutate({ id: task.id, input }, { onSuccess: onDone });
    } else {
      createTask.mutate(input, { onSuccess: onDone });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="task-title">Title</FieldLabel>
          <Input
            id="task-title"
            placeholder="e.g. Write the README"
            autoComplete="off"
            aria-invalid={!!errors.title}
            {...form.register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="task-description">Description</FieldLabel>
          <Textarea
            id="task-description"
            placeholder="Optional details"
            rows={3}
            aria-invalid={!!errors.description}
            {...form.register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="task-status">Status</FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  items={STATUS_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  <SelectTrigger id="task-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.status]} />
          </Field>

          <Field data-invalid={!!errors.dueDate}>
            <FieldLabel htmlFor="task-due-date">Due date</FieldLabel>
            <Input
              id="task-due-date"
              type="date"
              aria-invalid={!!errors.dueDate}
              {...form.register("dueDate")}
            />
            <FieldError errors={[errors.dueDate]} />
          </Field>
        </div>

        {/* Errors from the API, e.g. validation it rejected or no connection */}
        {mutation.error && <FieldError>{mutation.error.message}</FieldError>}
      </FieldGroup>

      <DialogFooter className="mt-4">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : task
              ? "Save changes"
              : "Create task"}
        </Button>
      </DialogFooter>
    </form>
  );
}
