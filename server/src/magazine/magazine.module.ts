import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Magazine, MagazineSchema } from './schemas/magazine.schema';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Magazine.name, schema: MagazineSchema },
    ]),
    CloudinaryModule,
    ActivityLogModule,
  ],
  controllers: [MagazineController],
  providers: [MagazineService],
})
export class MagazineModule {}
