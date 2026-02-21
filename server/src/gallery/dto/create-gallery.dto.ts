import {
  IsEnum,
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';
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
  year: number;

  @IsEnum(GalleryStatus)
  @IsOptional()
  status: GalleryStatus;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  cloudinaryPublicId: string;
}
