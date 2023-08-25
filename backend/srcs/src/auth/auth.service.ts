import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: any) {
    const payload: JwtPayload = {
      username: user.username42,
      sub: user.id42,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
