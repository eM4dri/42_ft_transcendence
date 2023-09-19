import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageConstants } from '../utils';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly cookieService: CookieService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token: string = this.cookieService.get(SessionStorageConstants.USER_TOKEN);  
    // sessionStorage.getItem(SessionStorageConstants.USER_TOKEN);
    if (token) {
      // if (!req.url.toString().includes('refresh')) {
        // req = req.clone({
        //   setHeaders: {
        //     Authorization: 'Bearer ' + token
        //   },
        // });
      // }
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          },
        });
    }

    return next.handle(req);
  }
}
