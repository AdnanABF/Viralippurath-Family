import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMagazineDto {
  @IsString()
  title: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsUrl()
  flipbookUrl: string;

  @IsOptional()
  @IsUrl()
  downloadUrl?: string;

  @IsEnum(['DRAFT', 'PUBLISHED'])
  status: 'DRAFT' | 'PUBLISHED';
}
