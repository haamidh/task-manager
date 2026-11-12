import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { TaskStatus } from '../../generated/prisma/enums.js';

export class CreateTaskDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  // @IsOptional skips the checks for undefined AND null, so null can be
  // sent to clear the description.
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  // Status may be left out (the database defaults it to TODO) but it can
  // never be null, so only undefined skips the check here.
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /** ISO 8601 date string, e.g. "2026-12-31". Null clears the due date. */
  @IsOptional()
  @IsISO8601({ strict: true })
  dueDate?: string | null;
}
