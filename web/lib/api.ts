import type {
  CreateTaskInput,
  Task,
  TaskFilters,
  UpdateTaskInput,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** An error response from the API, carrying its HTTP status code. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    // fetch only rejects when the request never got a response at all.
    throw new ApiError(
      "Could not reach the server. Check that the API is running.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  // DELETE responds with 204 and no body.
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/**
 * NestJS sends errors as { message: string | string[] }. Validation errors
 * are an array with one entry per failed rule, so join them into one line.
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: { message?: string | string[] } = await response.json();
    if (Array.isArray(body.message)) return body.message.join(". ");
    if (body.message) return body.message;
  } catch {
    // The body was not JSON; fall through to the generic message.
  }
  return `Request failed with status ${response.status}`;
}

export const tasksApi = {
  list(filters: TaskFilters = {}): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.order) params.set("order", filters.order);
    const query = params.toString();
    return request<Task[]>(`/tasks${query ? `?${query}` : ""}`);
  },

  create(input: CreateTaskInput): Promise<Task> {
    return request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  remove(id: string): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: "DELETE" });
  },
};
