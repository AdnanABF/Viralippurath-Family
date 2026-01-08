import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog, ActivityAction } from './schemas/activity-log.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '../admin/admin.schema';

@Controller('admin/activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  /**
   * GET /admin/activities
   * Supports pagination, entity type filtering, and action filtering
   * Example: /admin/activities?page=1&limit=10&type=EVENT&action=DELETE
   */
  @Get()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getActivities(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('type') type?: string,
    @Query('action') action?: ActivityAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.activityLogService.getPaginatedActivities({
      page: page ?? 1,
      limit: limit ?? 10,
      entityType: type,
      action,
      startDate,
      endDate,
    });
  }

  /**
   * GET /admin/activities/recent
   * Returns recent logs for dashboard widgets
   */
  @Get('recent')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getRecent(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ActivityLog[]> {
    return this.activityLogService.getRecentActivities(limit || 10);
  }
}
