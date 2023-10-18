import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async isAuthorized(request: any) {
    const { token } = request.handshake.auth;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        { secret: process.env.JWT_SECRET }
      );
      return payload
    } catch {
      throw new UnauthorizedException();
    }
  }
}
