import { TaskStatus } from '../../generated/prisma/enums.js';

export class CreateTaskDto {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  /** ISO 8601 date string, e.g. "2026-12-31" */
  dueDate?: string | null;
}
