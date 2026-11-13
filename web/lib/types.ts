export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

/** A task exactly as the API returns it. Dates are ISO 8601 strings. */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
}

/** Body for POST /tasks. Sending null clears an optional field. */
export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

/** Body for PATCH /tasks/:id. Only the fields sent are changed. */
export type UpdateTaskInput = Partial<CreateTaskInput>;

/** Query string options for GET /tasks. */
export interface TaskFilters {
  status?: TaskStatus;
  sort?: "createdAt" | "dueDate";
  order?: "asc" | "desc";
}
