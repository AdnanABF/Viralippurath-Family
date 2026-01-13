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
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

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
  status: NotificationStatus;
}
