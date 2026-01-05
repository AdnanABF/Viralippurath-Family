import {
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { EventStatus } from '../schemas/event.schema';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  type: string;

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  endDateTime: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
