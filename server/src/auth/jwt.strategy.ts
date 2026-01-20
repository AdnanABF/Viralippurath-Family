import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private adminService: AdminService,
  ) {
    const jwtSecret = config.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return JwtStrategy.extractJWT(request);
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      req.cookies.accessToken.length > 0
    ) {
      return req.cookies.accessToken;
    }
    return null;
  }

  /**
   * Validates the JWT payload.
   * Now includes a real-time check against the database to ensure the account is still active.
   */
  async validate(payload: any) {
    // 1. Check if the user is still active in the database
    const isActive = await this.adminService.validateUserActive(payload.sub);

    if (!isActive) {
      // If user is disabled, throw 401. This triggers the frontend to logout.
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact a Super Admin.',
      );
    }

    // 2. If active, return the user data to be attached to req.user
    return {
      userUuid: payload.sub,
      username: payload.username,
      role: payload.role,
      fullName: payload.fullName,
    };
  }
}
