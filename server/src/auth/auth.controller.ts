import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login
   * Standard login endpoint with rate limiting to prevent brute-force attacks.
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return await this.authService.login(body.username, body.password);
  }

  /**
   * POST /auth/refresh
   * Exchanges a refresh token for a new access/refresh token pair.
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @Post('refresh')
  async refresh(@Body() body: { userUuid: string; refreshToken: string }) {
    return await this.authService.refresh(body.userUuid, body.refreshToken);
  }

  /**
   * POST /auth/logout
   * Invalidates the user's session on the server side.
   * Requires a valid JWT access token.
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    // The user object is attached to the request by the JwtStrategy
    return await this.authService.logout(req.user.userUuid);
  }
}
