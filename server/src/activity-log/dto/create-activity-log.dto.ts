import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ActivityAction, EntityType } from '../schemas/activity-log.schema';

export class CreateActivityLogDto {
  @IsUUID()
  @IsNotEmpty()
  adminUuid: string;

  @IsString()
  @IsNotEmpty()
  adminUserName: string;

  @IsEnum(ActivityAction)
  @IsNotEmpty()
  action: ActivityAction;

  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsString()
  @IsNotEmpty()
  entityTitle: string;

  @IsString()
  @IsOptional()
  entityUuid?: string;
}
