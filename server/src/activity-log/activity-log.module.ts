import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { SystemLogModule } from '../system-log/system-log.module';

@Module({
  imports: [
    // Register the schema with Mongoose
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
    forwardRef(() => SystemLogModule),
  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
