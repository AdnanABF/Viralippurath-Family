import {
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { EventStatus, EventType } from '../schemas/event.schema';
import { IsAfter } from '../../common/decorators/is-after.decorator';

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

  @IsEnum(EventType)
  type: EventType;

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  @IsAfter('startDateTime', {
    message: 'End date must be equal to or after start date',
  })
  endDateTime: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
