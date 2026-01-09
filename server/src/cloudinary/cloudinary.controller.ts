import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * GET /cloudinary/sign
   * Generates a secure signature for client-side uploads to Cloudinary.
   * Restricts access to ADMIN and SUPER_ADMIN.
   * * @param folder - The target folder in Cloudinary (e.g., 'magazines', 'gallery')
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('sign')
  async getSignature(@Request() req, @Query('folder') folder: string) {
    // Standardized response is handled by the service and the TransformInterceptor
    return await this.cloudinaryService.generateSignature(
      folder || 'general',
      req?.user?.uuid,
    );
  }
}
