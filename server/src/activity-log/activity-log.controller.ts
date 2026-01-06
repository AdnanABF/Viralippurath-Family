import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog } from './schemas/activity-log.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '../admin/admin.schema';

@Controller('admin/activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getAll(): Promise<ActivityLog[]> {
    return this.activityLogService.getAllActivities();
  }

  /**
   * GET /admin/activities
   * Fetches the most recent activities for the dashboard
   */
  @Get()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getRecent(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ActivityLog[]> {
    return this.activityLogService.getRecentActivities(limit || 10);
  }
}
