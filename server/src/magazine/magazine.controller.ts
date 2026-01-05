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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  // ===== PUBLIC =====
  @Get('published')
  async getPublished() {
    return await this.magazineService.findPublished();
  }

  // ===== ADMIN =====
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin')
  async getAllAdmin() {
    return await this.magazineService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dto: CreateMagazineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'A PDF file is required to create a magazine',
      );
    }
    return await this.magazineService.create(dto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateMagazineDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.magazineService.update(uuid, dto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':uuid')
  async remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.magazineService.remove(uuid);
  }
}
