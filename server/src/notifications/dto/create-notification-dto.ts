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
import { IsAfter } from '../../common/decorators/is-after.decorator';

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
  @IsAfter('date', {
    message: 'Expiry date must be equal to or after publish date',
  })
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
