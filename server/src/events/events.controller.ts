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
  BadRequestException,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  async create(@Body() dto: CreateEventDto, @Request() req) {
    if (new Date(dto.endDateTime) <= new Date(dto.startDateTime)) {
      throw new BadRequestException(
        'End date-time must be strictly after the start date-time',
      );
    }
    return await this.eventsService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('admin')
  async getAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.eventsService.findAllAdmin({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      search,
      startDate,
      endDate,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':uuid')
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateEventDto,
    @Request() req,
  ) {
    if (dto.startDateTime && dto.endDateTime) {
      if (new Date(dto.endDateTime) <= new Date(dto.startDateTime)) {
        throw new BadRequestException(
          'End date-time must be strictly after the start date-time',
        );
      }
    }
    return await this.eventsService.update(uuid, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':uuid')
  async remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Request() req,
  ) {
    return await this.eventsService.remove(uuid, req.user);
  }

  @Get('published')
  async findPublished(
    @Query('type') type: 'upcoming' | 'past' | 'ongoing',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.eventsService.findPublished(
      type || 'upcoming',
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }
}
