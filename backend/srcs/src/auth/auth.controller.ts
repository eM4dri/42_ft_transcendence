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

@ApiExcludeController()
@Controller()
export class AuthController {
  constructor(
    private jwtAuthService: AuthService,
  ) {}
  @Get(process.env.FORTYTWO_CLIENT_URL)
  @UseGuards(FortyTwoGuard)
  login() {
    return;
  }

  @Get(process.env.FORTYTWO_CLIENT_URL_CALLBACK)
  @UseGuards(FortyTwoGuard)
  async redirect(
    @GetUser() user42: User,
    // @GetUser('username42') email: string,
    @Res() res: Response,
  ) {
    // console.log('email', email);
    const user: { accessToken: string } =
      this.jwtAuthService.login(user42);
    return res.send(user);
  }
}
