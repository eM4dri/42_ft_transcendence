import { Controller, Get, Param, Res, Req, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { FortyTwoGuard } from "./guard";
import { AuthService } from "./auth.service";
import { ApiExcludeController } from "@nestjs/swagger";
import { GetUser } from "./decorator";
import { User } from "@prisma/client";
import { FakeAuthService } from "./fake.auth.service";
import { Request } from 'express';
import { RefreshGuard } from "./guard/refresh.guard";

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
    @GetUser() user42: User,
    @Res() res: Response,
  ) {
    const user: { Tokens: [string, string] } = this.authService.login(user42);
    // return res.send(user);
    res.cookie("USER_TOKEN", user.Tokens[0]);
    res.cookie("REFRESH_TOKEN", user.Tokens[1]);
    res.redirect(process.env.WEB_URL);
  }

  @Get(`${process.env.FAKE_LOGIN_URL}/:username`)
  async loginImpostor(
    @Param("username") username: string,
    @Res() res: Response,
  ) {
    const user: { accessToken: string } = await this.fakeAuthService.fakeLogin(
      username,
    );
    // return res.send(user);
    res.cookie("USER_TOKEN", user.accessToken);
    res.redirect(process.env.WEB_URL);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.cookie("USER_TOKEN", null);
    const token: string = await this.authService.refreshToken(req.cookies['REFRESH_TOKEN']);
    res.cookie("USER_TOKEN", token);
    res.redirect('/swagger');
  }
}
