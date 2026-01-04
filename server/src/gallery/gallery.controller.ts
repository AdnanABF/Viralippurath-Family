import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // ===== PUBLIC =====
  @Get('published')
  async getPublished() {
    return await this.galleryService.findPublished();
  }

  // ===== ADMIN =====
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin')
  async getAllAdmin() {
    return await this.galleryService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGalleryDto,
  ) {
    return await this.galleryService.create(dto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateGalleryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.galleryService.update(uuid, dto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':uuid')
  async remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.galleryService.remove(uuid);
  }
}
