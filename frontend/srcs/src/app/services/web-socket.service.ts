
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageConstants } from '../utils';
import { Injectable } from '@angular/core';

@Injectable()
export class MySocket extends Socket {
    constructor(
        private cookieSevice: CookieService
    ) {
        super({ url: environment.apiUrl, options: {} });
        this.ioSocket['auth'] = { token: this.cookieSevice.get(SessionStorageConstants.USER_TOKEN) };
    }
}