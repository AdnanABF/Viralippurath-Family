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
  title_en: string;

  @IsString()
  @IsOptional()
  title_ml?: string;

  @IsString()
  @MinLength(10)
  description_en: string;

  @IsString()
  @IsOptional()
  description_ml?: string;

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
