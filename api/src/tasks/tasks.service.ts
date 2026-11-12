import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListTasksQueryDto = {}): Promise<Task[]> {
    const { status, sort = 'createdAt' } = query;
    // Newest first by default; soonest due date first when sorting by it.
    const order = query.order ?? (sort === 'dueDate' ? 'asc' : 'desc');

    return this.prisma.task.findMany({
      where: { status },
      orderBy:
        sort === 'dueDate'
          ? // Tasks without a due date always go to the end of the list.
            [{ dueDate: { sort: order, nulls: 'last' } }, { createdAt: 'desc' }]
          : { createdAt: order },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: toDate(dto.dueDate),
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: toDate(dto.dueDate),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }
}

/**
 * Converts the ISO string from the request into a Date for Prisma.
 * `undefined` means "leave unchanged" and `null` means "clear the due date",
 * so both are passed through as they are.
 */
function toDate(value: string | null | undefined): Date | null | undefined {
  return typeof value === 'string' ? new Date(value) : value;
}
