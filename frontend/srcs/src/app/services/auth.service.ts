import { Injectable } from '@angular/core';
import  jwtDecode  from 'jwt-decode'
import { AuthModel } from '../models/core/auth.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly cookieService : CookieService
  ) { }

  saveToSession(key: string, value: string){
    sessionStorage.setItem(key, value);
  }

  readFromSession(key: string): AuthModel.UserTokenData {
    return  this.getTokenData(sessionStorage.getItem(key) || '');
  }

  readFromCookie(key: string): AuthModel.UserTokenData {
    return  this.getTokenData(this.cookieService.get(key) || '');
  }

  private getTokenData(token: string): AuthModel.UserTokenData {
    return  token ? jwtDecode(token): AuthModel.userTokenData;
  }
}
