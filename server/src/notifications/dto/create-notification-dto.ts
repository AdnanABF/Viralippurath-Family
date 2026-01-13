import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import {
  NotificationStatus,
  NotificationCategory,
} from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title_en: string;

  @IsString()
  @IsOptional()
  title_ml?: string;

  @IsString()
  @IsNotEmpty()
  content_en: string;

  @IsString()
  @IsOptional()
  content_ml?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsEnum(NotificationCategory)
  @IsOptional()
  category?: NotificationCategory;

  @IsEnum(NotificationStatus)
  @IsNotEmpty()
  status: NotificationStatus;
}
