import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { TokenConstants } from './utils';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private appService: AppService) { }

  @Get()
  welcome(@Req() req: Request): string {
    return this.appService.welcome(req.cookies[TokenConstants.USER_TOKEN]);
  }
}
