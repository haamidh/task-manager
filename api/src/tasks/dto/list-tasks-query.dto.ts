import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { TaskStatus } from '../../generated/prisma/enums.js';

export const SORT_FIELDS = ['createdAt', 'dueDate'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

/** Query string for GET /tasks, e.g. ?status=TODO&sort=dueDate&order=asc */
export class ListTasksQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sort?: (typeof SORT_FIELDS)[number];

  @IsOptional()
  @IsIn(SORT_ORDERS)
  order?: (typeof SORT_ORDERS)[number];
}
