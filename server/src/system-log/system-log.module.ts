import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogController } from './system-log.controller';
import { SystemLogService } from './system-log.service';
import { SystemLog, SystemLogSchema } from './schemas/system-log.schema';

@Global() // Making it global so you don't have to import it in every single module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemLog.name, schema: SystemLogSchema },
    ]),
  ],
  controllers: [SystemLogController],
  providers: [SystemLogService],
  exports: [SystemLogService],
})
export class SystemLogModule {}
