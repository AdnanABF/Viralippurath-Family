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
  title: string;

  @IsDateString()
  @IsNotEmpty()
  publishedDate: string;

  @IsEnum(MagazineStatus)
  @IsOptional()
  status?: MagazineStatus;
}
