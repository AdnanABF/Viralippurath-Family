import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsDateString()
  date: string;

  @IsEnum(['HIGH', 'NORMAL'])
  priority: 'HIGH' | 'NORMAL';

  @IsEnum(['DRAFT', 'PUBLISHED'])
  status: 'DRAFT' | 'PUBLISHED';
}
