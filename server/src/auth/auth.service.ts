import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Validates admin credentials and updates login metadata.
   * Returns standardized data with a success message.
   */
  async login(username: string, password: string) {
    const admin = await this.adminService.findByUsername(username);

    // Using generic error to prevent account enumeration
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    const tokens = await this.generateTokenPair(admin);

    return {
      data: tokens,
      message: 'Logged in successfully',
    };
  }

  /**
   * Validates refresh token and issues a new pair.
   */
  async refresh(userUuid: string, refreshToken: string) {
    if (!refreshToken || !userUuid) {
      throw new UnauthorizedException('Invalid session');
    }

    const admin = await this.adminService.findByUuid(userUuid);

    if (!admin || !admin.isActive || !admin.refreshTokenHash) {
      throw new UnauthorizedException('Invalid session');
    }

    const isValid = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid session');
    }

    const tokens = await this.generateTokenPair(admin);

    return {
      data: tokens,
      message: 'Token refreshed successfully',
    };
  }

  /**
   * Generates Access and Refresh tokens.
   * Stores the hash of the refresh token in the database for security.
   */
  private async generateTokenPair(admin: any) {
    const payload = {
      sub: admin.uuid,
      username: admin.username,
      role: admin.role,
      fullName: admin.fullName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
    });

    // Generate a secure random string for refresh token
    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Save refresh token hash to admin record
    admin.refreshTokenHash = refreshTokenHash;
    await admin.save();

    return {
      accessToken,
      refreshToken,
    };
  }
}
