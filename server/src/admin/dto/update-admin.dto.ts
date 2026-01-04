import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { AdminRole } from '../admin.schema';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
