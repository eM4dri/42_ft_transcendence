import {
  Controller,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoGuard } from './guard';
import { AuthService } from './auth.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { FakeAuthService } from './fake.auth.service';

@ApiExcludeController()
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private fakeAuthService: FakeAuthService,
  ) {}
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
    const user: { accessToken: string } =
      this.authService.login(user42);
    // return res.send(user);
    res.cookie('USER_TOKEN', user.accessToken);
    res.redirect(process.env.WEB_URL);
  }

  @Get(process.env.FAKE_LOGIN_URL)
  async loginImpostor(
    @Res() res: Response,
  ) {
    const user: { accessToken: string } =
      await this.fakeAuthService.fakeLogin();
    // return res.send(user);
    res.cookie('USER_TOKEN', user.accessToken);
    res.redirect(process.env.WEB_URL);
  }
}
