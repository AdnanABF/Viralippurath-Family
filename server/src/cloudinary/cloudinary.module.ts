import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
