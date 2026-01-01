import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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
  getPublished() {
    return this.magazineService.findPublished();
  }

  // ===== ADMIN =====
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin')
  getAllAdmin() {
    return this.magazineService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  create(@Body() dto: CreateMagazineDto) {
    return this.magazineService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMagazineDto) {
    return this.magazineService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.magazineService.remove(id);
  }
}
