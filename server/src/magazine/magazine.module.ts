import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Magazine, MagazineSchema } from './schemas/magazine.schema';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Magazine.name, schema: MagazineSchema },
    ]),
  ],
  controllers: [MagazineController],
  providers: [MagazineService],
})
export class MagazineModule {}
