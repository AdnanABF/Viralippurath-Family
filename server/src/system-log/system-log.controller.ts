import {
  Controller,
  Get,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SystemLogService } from './system-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '../admin/admin.schema';

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
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('method') method?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('correlationId') correlationId?: string,
  ) {
    return this.systemLogService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      method: method,
      search,
      startDate: startDate,
      endDate: endDate,
      correlationId: correlationId,
    });
  }

  /**
   * DELETE /system-log/cleanup
   * Restricted to SUPER_ADMIN only for safety
   */
  @Get('cleanup-status')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getCleanupStatus(@Request() req: any) {
    return await this.systemLogService.getCleanupStatus(req.user);
  }

  /**
   * DELETE /system-log/cleanup
   * Restricted to SUPER_ADMIN only for safety
   */
  @Delete('cleanup')
  @Roles(AdminRole.SUPER_ADMIN)
  async cleanup(@Request() req) {
    return await this.systemLogService.cleanOldLogs(req.user);
  }
}
