import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { MagazineStatus } from '../schemas/magazine.schema';

export class CreateMagazineDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  publishedDate: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsUrl()
  @IsNotEmpty()
  flipbookUrl: string;

  @IsOptional()
  @IsUrl()
  downloadUrl?: string;

  @IsEnum(MagazineStatus)
  status: MagazineStatus;
}
