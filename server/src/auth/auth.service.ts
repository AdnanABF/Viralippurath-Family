import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';
import { SystemLogService } from '../system-log/system-log.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly systemLogService: SystemLogService,
  ) {}

  /**
   * Validates admin credentials and updates login metadata.
   */
  async login(username: string, password: string) {
    try {
      const admin = await this.adminService.findByUsername(username, true);

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
    } catch (error) {
      // 1. If it's a planned UnauthorizedException, we don't necessarily log it as a "System Error"
      // unless you want to track brute force (usually handled by a different security log).
      if (error instanceof UnauthorizedException) throw error;

      // 2. Log actual technical failures (DB down, Bcrypt crash, etc.)
      await this.handleError(error, 'POST', '/auth/login', { username });
      throw new InternalServerErrorException('An error occurred during login');
    }
  }

  /**
   * Validates refresh token and issues a new pair.
   */
  async refresh(userUuid: string, refreshToken: string) {
    try {
      if (!refreshToken || !userUuid) {
        throw new UnauthorizedException('Invalid session');
      }

      const admin = await this.adminService.findByUuid(userUuid);

      if (!admin || !admin.isActive || !admin.refreshTokenHash) {
        throw new UnauthorizedException('Invalid session');
      }

      const isValid = await bcrypt.compare(
        refreshToken,
        admin.refreshTokenHash,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid session');
      }

      const tokens = await this.generateTokenPair(admin);

      return {
        data: tokens,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      await this.handleError(error, 'POST', '/auth/refresh', { userUuid });
      throw new InternalServerErrorException(
        'An error occurred during token refresh',
      );
    }
  }

  /**
   * Generates Access and Refresh tokens.
   */
  private async generateTokenPair(admin: any) {
    try {
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

      const refreshToken = randomBytes(64).toString('hex');
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      admin.refreshTokenHash = refreshTokenHash;
      await admin.save();

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // If token generation fails (e.g., JWT secret missing), this is a critical system error
      await this.handleError(error, 'INTERNAL', 'TOKEN_GENERATION', {
        username: admin.username,
      });
      throw new InternalServerErrorException(
        'Could not generate authentication tokens',
      );
    }
  }

  /**
   * Helper method to record technical system logs for Auth
   */
  private async handleError(
    error: any,
    method: string,
    path: string,
    payload: any,
  ) {
    this.logger.error(
      `${method} ${path} failed: ${error.message}`,
      error.stack,
    );

    await this.systemLogService.log({
      errorCode: error.code?.toString() || error.name || 'AUTH_ERROR',
      message: error.message,
      stack: error.stack,
      path,
      method,
      payload, // Payload here is already masked in the calling methods (no passwords)
      userUuid: payload?.userUuid || 'SYSTEM_AUTH',
    });
  }
}
