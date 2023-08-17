import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcome() {
    return "Hello, you've reached API default page, append <strong>/swagger</strong> for API documentation";
  }
}
