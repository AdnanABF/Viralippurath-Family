import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  NotificationPriority,
  NotificationStatus,
} from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  date: string;

  @IsEnum(NotificationPriority)
  priority: NotificationPriority;

  @IsEnum(NotificationStatus)
  status: NotificationStatus;
}
