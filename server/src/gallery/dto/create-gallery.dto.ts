import {
  IsEnum,
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GalleryStatus } from '../schemas/gallery.schema';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsString()
  @IsNotEmpty()
  album: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number) // Crucial for FormData to convert string to number
  year: number;

  @IsEnum(GalleryStatus)
  @IsOptional()
  status: GalleryStatus;
}
