import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./strategy";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) { }

  login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    return {
      Tokens: this.getTokens(payload),
      //accessToken: this.jwtService.sign(payload),
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
        { secret: process.env.JWT_SECRET },
      );
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  getTokens(payload: JwtPayload): [refreshToken: string, accessToken: string] {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({
      sub: payload.sub,
    }, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
      secret: process.env.JWT_REFRESH
    });
    return [accessToken, refreshToken];
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    const decode: JwtPayload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH
    });

    const user = await this.prisma.user.findUnique({
      where: { userId: decode.sub },
      select: {
        username: true,
        role: true,
        userId: true,
      },
    });

    const payload: JwtPayload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };

    const newToken = this.jwtService.sign(payload);
    if (!newToken) throw new ForbiddenException("Access Denied");
    return newToken;
  }
}
