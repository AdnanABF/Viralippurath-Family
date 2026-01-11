import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
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
   * Supports pagination, entity type filtering, action filtering, and correlationId searching
   */
  @Get()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getActivities(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('type') type?: string,
    @Query('action') action?: ActivityAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('correlationId') correlationId?: string,
  ) {
    return this.activityLogService.getPaginatedActivities({
      page: page ?? 1,
      limit: limit ?? 10,
      entityType: type,
      action,
      startDate,
      endDate,
      correlationId,
      adminUserUuid: req?.user?.uuid,
    });
  }

  /**
   * GET /admin/activities/recent
   * Returns recent logs for dashboard widgets
   */
  @Get('recent')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getRecent(
    @Request() req,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ActivityLog[]> {
    return this.activityLogService.getRecentActivities(
      limit || 10,
      req?.user?.uuid,
    );
  }
}
