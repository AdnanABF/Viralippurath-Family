import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '../admin/admin.schema';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /admin/dashboard/stats
   * Returns a summary of all published content for the dashboard cards
   */
  @Get('stats')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async getStats() {
    return this.dashboardService.getSummaryStats();
  }
}
