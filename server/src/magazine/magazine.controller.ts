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
  Request,
} from '@nestjs/common';
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
  async create(@Body() dto: CreateMagazineDto, @Request() req) {
    return await this.magazineService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':uuid')
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateMagazineDto,
    @Request() req,
  ) {
    return await this.magazineService.update(uuid, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':uuid')
  async remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Request() req,
  ) {
    return await this.magazineService.remove(uuid, req.user);
  }
}
