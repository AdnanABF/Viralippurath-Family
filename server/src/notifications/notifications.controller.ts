import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { UpdateNotificationDto } from './dto/update-notification-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ===== PUBLIC =====
  @Get('published')
  async getPublished() {
    return await this.notificationsService.findPublished();
  }

  // ===== ADMIN =====
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin')
  async getAllAdmin() {
    return await this.notificationsService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(@Body() dto: CreateNotificationDto, @Request() req) {
    return await this.notificationsService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':uuid')
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateNotificationDto,
    @Request() req,
  ) {
    return await this.notificationsService.update(uuid, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':uuid')
  async remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Request() req,
  ) {
    return await this.notificationsService.remove(uuid, req.user);
  }
}
