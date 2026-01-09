import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SystemLogService } from './system-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/system-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN') // Restrict to Super Admin only for security
export class SystemLogController {
  constructor(private readonly systemLogService: SystemLogService) {}

  /**
   * Fetch all logs with pagination and optional filtering by error code.
   * Accessible via: GET /api/admin/system-logs?page=1&limit=20
   */
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('errorCode') errorCode?: string,
  ) {
    return this.systemLogService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      errorCode,
    });
  }
}
