import { z } from "zod";
import { TASK_STATUSES } from "@/lib/types";

/**
 * Validation for the create/edit form. It mirrors the rules the API enforces
 * so most mistakes are caught before a request is sent.
 * Empty strings mean "not set" for the optional fields.
 */
export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer"),
  status: z.enum(TASK_STATUSES),
  // The native date input gives "" or a "YYYY-MM-DD" string.
  dueDate: z
    .string()
    .refine(
      (value) => value === "" || !Number.isNaN(Date.parse(value)),
      "Enter a valid date",
    ),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
