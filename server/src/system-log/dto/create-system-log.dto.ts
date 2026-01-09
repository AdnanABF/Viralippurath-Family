import { IsOptional, IsString, IsObject, IsNotEmpty } from 'class-validator';

export class CreateSystemLogDto {
  @IsString()
  @IsNotEmpty()
  errorCode: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsOptional()
  @IsObject()
  payload?: any;

  @IsOptional()
  @IsString()
  userUuid?: string; // Flexible for Admin, Super Admin, or future Members

  @IsOptional()
  @IsString()
  ipAddress?: string;
}
