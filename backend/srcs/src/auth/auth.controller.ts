import { Controller, Get, Param, Res, Req, UseGuards, Post, Body, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { FortyTwoGuard, JwtGuard, RefreshGuard } from "./guard";
import { AuthService } from "./auth.service";
import { ApiExcludeController } from "@nestjs/swagger";
import { GetUser } from "./decorator";
// import { User } from "@prisma/client";
import { FakeAuthService } from "./fake.auth.service";
import { TokenConstants } from "src/utils";
import { ValidateDto } from "src/tfa/dto";
import { TfaService } from "src/tfa/tfa.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResponseIntraUserDto } from "./dto";

@ApiExcludeController()
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private fakeAuthService: FakeAuthService,
    private tfaService: TfaService,
    private eventEmitter: EventEmitter2
  ) { }
  @Get(process.env.FORTYTWO_CLIENT_URL)
  @UseGuards(FortyTwoGuard)
  login() {
    return;
  }

  @Get(process.env.FORTYTWO_CLIENT_URL_CALLBACK)
  @UseGuards(FortyTwoGuard)
  async redirect(
    @Req() req: Request,
    @GetUser() user42: ResponseIntraUserDto,
    @Res() res: Response,
  ) {
    console.log('FORTYTWO_CLIENT_URL_CALLBACK',user42);
    const isBanned = await this.authService.isBanned(user42.userId);
    let navigate :string = ''; 
    if (isBanned) {
      res.cookie(TokenConstants.UNAUTHORIZED_TOKEN, user42.userId);
    }
    else {
      if (user42.isNew) {
        navigate = '/profile';
      }
      const needTfa: boolean = await this.authService.tfaNeeded(user42.userId);
      if ( !needTfa ){
        const { accessToken, refreshToken } = await this.authService.login(user42);
        res.cookie(TokenConstants.USER_TOKEN, accessToken);
        res.cookie(TokenConstants.REFRESH_TOKEN, refreshToken);
      } else {
        res.cookie(TokenConstants.TFA_TOKEN, user42.userId);
      }
    }
    const hostName = new URL(`http://${req.headers['host']}`).hostname;
    res.redirect(`http://${hostName}:${process.env.WEB_PORT}${navigate}`);
  }

  @Get(`${process.env.FAKE_LOGIN_URL}/:username`)
  async loginImpostor(
    @Req() req: Request,
    @Param("username") username: string,
    @Res() res: Response,
  ) {
    const tfaUserId: string = await this.fakeAuthService.tfaNeeded(username);
    if (tfaUserId === undefined){
      const { accessToken, refreshToken } = await this.fakeAuthService.fakeLogin(username);
      res.cookie(TokenConstants.USER_TOKEN, accessToken);
      res.cookie(TokenConstants.REFRESH_TOKEN, refreshToken);
    } else {
      res.cookie(TokenConstants.TFA_TOKEN, tfaUserId);
    }
    const hostName = new URL(`http://${req.headers['host']}`).hostname;
    res.redirect(`http://${hostName}:${process.env.WEB_PORT}`);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@GetUser('sub') userId): Promise<{ accessToken, refreshToken }> {
    const isBanned = await this.authService.isBanned(userId);
    if (isBanned) {
      this.eventEmitter.emit('userBanned', userId);
    } else {
      const { accessToken, refreshToken } = await this.authService.refreshToken(userId);
      const response = {
        accessToken: accessToken,
        refreshToken: refreshToken
      };
      return response;
    }
  }

  @Post('login/tfa/validate')
  async validarCodigoTFA(
    @Body() body: ValidateDto, 
    @Res() res: any
  ) {
     const validtfa = await this.tfaService.validTFACode(body, res);
     if (validtfa) { 
      const { accessToken, refreshToken } = await this.authService.refreshToken(body.userid);
      return res.status(HttpStatus.OK).json({ response : { accessToken:accessToken, refreshToken:refreshToken} });
     } 
     return res;
  }

  @Get('ping')
  @UseGuards(JwtGuard)
  ping(@GetUser('role') rol)  {
    return `Your new Role is ${rol}`;
  }
}
