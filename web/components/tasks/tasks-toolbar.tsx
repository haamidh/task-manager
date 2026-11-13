"use client";

import { STATUS_LABELS } from "@/components/tasks/task-status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES, type TaskFilters, type TaskStatus } from "@/lib/types";

export type StatusFilter = TaskStatus | "ALL";

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  ...TASK_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

/** Each sort choice maps to the `sort` and `order` query params of the API. */
export const SORT_OPTIONS = {
  newest: {
    label: "Newest first",
    params: { sort: "createdAt", order: "desc" },
  },
  dueSoonest: {
    label: "Due date: soonest first",
    params: { sort: "dueDate", order: "asc" },
  },
  dueLatest: {
    label: "Due date: latest first",
    params: { sort: "dueDate", order: "desc" },
  },
} as const satisfies Record<
  string,
  { label: string; params: Pick<TaskFilters, "sort" | "order"> }
>;

export type SortOption = keyof typeof SORT_OPTIONS;

const SORT_SELECT_ITEMS = Object.entries(SORT_OPTIONS).map(
  ([value, option]) => ({ value: value as SortOption, label: option.label }),
);

interface TasksToolbarProps {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function TasksToolbar({
  status,
  onStatusChange,
  sort,
  onSortChange,
}: TasksToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        items={STATUS_FILTER_OPTIONS}
        value={status}
        onValueChange={(value) => value && onStatusChange(value)}
      >
        <SelectTrigger aria-label="Filter by status" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={SORT_SELECT_ITEMS}
        value={sort}
        onValueChange={(value) => value && onSortChange(value)}
      >
        <SelectTrigger aria-label="Sort tasks" className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_SELECT_ITEMS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
