import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  welcome(): string {
    return this.appService.welcome();
  }
}
