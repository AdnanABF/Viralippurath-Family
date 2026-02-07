import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '../admin/admin.schema';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateEventDto, @Request() req) {
    return await this.eventsService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @Get('admin')
  async getAllAdmin(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.eventsService.findAllAdmin({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      type,
      search,
      startDate,
      endDate,
      adminUserUuid: req?.user?.uuid,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @Patch(':uuid')
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateEventDto,
    @Request() req,
  ) {
    return await this.eventsService.update(uuid, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  @Delete(':uuid')
  async remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Request() req,
  ) {
    return await this.eventsService.remove(uuid, req.user);
  }

  @Get('published')
  async findPublished(
    @Query('timeline') timeline?: 'upcoming' | 'past' | 'ongoing',
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.eventsService.findPublished({
      timeline: timeline || 'upcoming',
      type: type || 'ALL',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }
}
