import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from './admin.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(AdminRole.SUPER_ADMIN)
  async getAllAdmins(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return await this.adminService.findAll({
      page: Number(page),
      limit: Number(limit),
      role,
      status,
      search,
      adminUserUuid: req?.user?.uuid,
    });
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN)
  async create(@Body() createDto: CreateAdminDto, @Request() req) {
    return await this.adminService.createAdmin(createDto, req.user);
  }

  @Patch(':uuid')
  @Roles(AdminRole.SUPER_ADMIN)
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateAdminDto,
    @Request() req,
  ) {
    return await this.adminService.updateAdmin(uuid, updateDto, req.user);
  }

  @Delete(':uuid')
  @Roles(AdminRole.SUPER_ADMIN)
  async remove(@Param('uuid') uuid: string, @Request() req) {
    return await this.adminService.removeAdmin(uuid, req.user);
  }
}
