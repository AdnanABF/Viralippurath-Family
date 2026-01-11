import { Module, Global, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogController } from './system-log.controller';
import { SystemLogService } from './system-log.service';
import { SystemLog, SystemLogSchema } from './schemas/system-log.schema';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Global() // Making it global so you don't have to import it in every single module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemLog.name, schema: SystemLogSchema },
    ]),
    forwardRef(() => ActivityLogModule),
  ],
  controllers: [SystemLogController],
  providers: [SystemLogService],
  exports: [SystemLogService],
})
export class SystemLogModule {}
