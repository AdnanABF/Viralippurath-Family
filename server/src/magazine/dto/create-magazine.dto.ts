import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MagazineStatus } from '../schemas/magazine.schema';

export class CreateMagazineDto {
  @IsString()
  @IsNotEmpty()
  title_en: string;

  @IsString()
  @IsOptional()
  title_ml?: string;

  @IsDateString()
  @IsNotEmpty()
  publishedDate: string;

  @IsEnum(MagazineStatus)
  @IsOptional()
  status?: MagazineStatus;

  @IsString()
  @IsNotEmpty()
  pdfUrl: string;

  @IsString()
  @IsNotEmpty()
  cloudinaryPublicId: string;
}
