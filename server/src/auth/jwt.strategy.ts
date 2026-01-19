import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const jwtSecret = config.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      // Modified: Use a custom extractor to pull the JWT from cookies
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return JwtStrategy.extractJWT(request);
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback for testing/mobile
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Helper method to extract the access token from the request cookies.
   */
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

  async validate(payload: any) {
    // This payload is the decoded JWT. The return value is attached to req.user
    return {
      userUuid: payload.sub,
      username: payload.username,
      role: payload.role,
      fullName: payload.fullName,
    };
  }
}
