import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  /**
   * GET /auth/me
   * Returns the current user's profile based on the HttpOnly cookie.
   * This is used by the frontend on app load to verify the session.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    // The JwtStrategy.validate() return value is available here as req.user
    return {
      data: {
        user: req.user,
      },
    };
  }

  /**
   * POST /auth/login
   * Authenticates user and sets HttpOnly cookies.
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.username, body.password);

    this.setCookies(res, result.data);

    return {
      message: result.message,
      data: { user: result.data.user },
    };
  }

  /**
   * POST /auth/refresh
   * Uses refresh token from cookie to issue new cookies.
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Body() body: { userUuid: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refreshToken'];
    const userUuid = body.userUuid;

    const result = await this.authService.refresh(userUuid, refreshToken);

    this.setCookies(res, result.data);

    return {
      message: result.message,
      data: { user: result.data.user },
    };
  }

  /**
   * POST /auth/logout
   * Clears cookies and invalidates session.
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.logout(req.user.userUuid);

    this.clearCookies(res);

    return result;
  }

  /**
   * Helper to set secure HttpOnly cookies
   */
  private setCookies(res: Response, tokenData: any) {
    const refreshMaxAge = this.parseDurationToMs(
      tokenData.refreshTokenExpiresIn,
    );
    const accessMaxAge = this.parseDurationToMs(tokenData.accessTokenExpiresIn);

    const isProduction = this.configService.get('NODE_ENV') === 'production';

    // Scoping to .viralippurath.com allows www and api subdomains to share it
    const domain = isProduction ? '.viralippurath.com' : 'localhost';

    const baseOptions = {
      httpOnly: true,
      secure: true, // Always true for HTTPS production
      sameSite: (isProduction ? 'lax' : 'lax') as 'lax',
      domain: domain,
      path: '/',
    };

    res.cookie('accessToken', tokenData.accessToken, {
      ...baseOptions,
      maxAge: accessMaxAge,
    });

    res.cookie('refreshToken', tokenData.refreshToken, {
      ...baseOptions,
      maxAge: refreshMaxAge,
    });
  }

  /**
   * Helper to clear cookies on logout
   */
  private clearCookies(res: Response) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const domain = isProduction ? '.viralippurath.com' : 'localhost';

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as 'lax',
      domain: domain,
      path: '/',
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }

  /**
   * Simple helper to convert string duration to ms
   */
  private parseDurationToMs(duration: string): number {
    if (typeof duration !== 'string') return 3600000;
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1));
    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      case 's':
        return value * 1000;
      default:
        return 3600000;
    }
  }
}
