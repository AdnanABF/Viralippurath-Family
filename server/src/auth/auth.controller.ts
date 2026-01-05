import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @Post('refresh')
  async refresh(@Body() body: { userUuid: string; refreshToken: string }) {
    return this.authService.refresh(body.userUuid, body.refreshToken);
  }
}
