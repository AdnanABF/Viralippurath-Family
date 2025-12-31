import { IsEnum, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateGalleryDto {
  @IsUrl()
  imageUrl: string;

  @IsString()
  caption: string;

  @IsString()
  album: string;

  @IsInt()
  year: number;

  @IsEnum(['DRAFT', 'PUBLISHED'])
  status: 'DRAFT' | 'PUBLISHED';
}
