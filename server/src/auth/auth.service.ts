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

  async login(username: string, password: string) {
    const admin = await this.adminService.findByUsername(username);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenPair(admin);
  }

  async refresh(userId: string, refreshToken: string) {
    if (!refreshToken || !userId) {
      throw new UnauthorizedException();
    }

    const admin = await this.adminService.findById(userId);
    if (!admin || !admin.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return this.generateTokenPair(admin);
  }

  private async generateTokenPair(admin: any) {
    const payload = {
      sub: admin._id,
      username: admin.username,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'), // Use Access Expiry
    });

    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    admin.refreshTokenHash = refreshTokenHash;
    await admin.save();

    return {
      accessToken,
      refreshToken,
    };
  }
}
