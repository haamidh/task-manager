import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto.js';

// Same rules as CreateTaskDto, but every field may be left out.
// skipNullProperties: false means only a missing field is skipped; an
// explicit null (e.g. { "title": null }) is still validated and rejected.
export class UpdateTaskDto extends PartialType(CreateTaskDto, {
  skipNullProperties: false,
}) {}
