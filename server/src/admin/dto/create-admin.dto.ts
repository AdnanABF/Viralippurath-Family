import {
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { AdminRole } from '../admin.schema';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(AdminRole, { message: 'Valid role is required' })
  role: AdminRole;

  @IsOptional()
  isActive?: boolean;
}
