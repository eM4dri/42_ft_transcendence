import { Controller, Get, Param, Res, Req, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { FortyTwoGuard, RefreshGuard } from "./guard";
import { AuthService } from "./auth.service";
import { ApiExcludeController } from "@nestjs/swagger";
import { GetUser } from "./decorator";
import { User } from "@prisma/client";
import { FakeAuthService } from "./fake.auth.service";
import { TokenConstants } from "src/utils";

@ApiExcludeController()
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private fakeAuthService: FakeAuthService,
  ) { }
  @Get(process.env.FORTYTWO_CLIENT_URL)
  @UseGuards(FortyTwoGuard)
  login() {
    return;
  }

  @Get(process.env.FORTYTWO_CLIENT_URL_CALLBACK)
  @UseGuards(FortyTwoGuard)
  redirect(
    @Req() req: Request,
    @GetUser() user42: User,
    @Res() res: Response,
  ) {
    const { accessToken2, refresh2Token } = this.authService.login(user42);
    res.cookie(TokenConstants.USER_TOKEN, accessToken);
    res.cookie(TokenConstants.REFRESH_TOKEN, refreshToken);
    const hostName = new URL(`http://${req.headers['host']}`).hostname;
    res.redirect(`http://${hostName}:${process.env.WEB_PORT}`);
  }

  @Get(`${process.env.FAKE_LOGIN_URL}/:username`)
  async loginImpostor(
    @Req() req: Request,
    @Param("username") username: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.fakeAuthService.fakeLogin(username);
    res.cookie(TokenConstants.USER_TOKEN, accessToken);
    res.cookie(TokenConstants.REFRESH_TOKEN, refreshToken);
    const hostName = new URL(`http://${req.headers['host']}`).hostname;
    res.redirect(`http://${hostName}:${process.env.WEB_PORT}`);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@GetUser('sub') userId): Promise<{accessToken, refreshToken}> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(userId);
    const response = {
      accessToken: accessToken,
      refreshToken: refreshToken 
    };
    return response;
  }
}
