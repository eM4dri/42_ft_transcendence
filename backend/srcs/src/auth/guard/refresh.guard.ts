import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.REFRESH_TOKEN;
    if (!refreshToken) {
      return false;
    }
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH
      });
      return true;
    } catch (error) { return false }
  }
}
