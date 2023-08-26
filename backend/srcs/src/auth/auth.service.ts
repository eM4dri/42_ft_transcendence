import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
