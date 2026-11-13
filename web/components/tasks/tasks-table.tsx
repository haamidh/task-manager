import { PencilIcon } from "lucide-react";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDueDate, formatTimestamp } from "@/lib/format";
import type { Task } from "@/lib/types";

const COLUMN_COUNT = 5;

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

export function TasksTable({ tasks, onEdit }: TasksTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                className="h-24 text-center text-muted-foreground"
              >
                No tasks yet
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="max-w-md whitespace-normal">
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="line-clamp-2 text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    formatDueDate(task.dueDate)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatTimestamp(task.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit "${task.title}"`}
                    onClick={() => onEdit(task)}
                  >
                    <PencilIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
