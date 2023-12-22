import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
import { AuthModel } from '../models/core/auth.model';
import { CookieService } from 'ngx-cookie-service';
import { CookieConstants } from '../utils';
import { Role } from '../models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;
  // roleAs: string = 'USER';
  constructor(
    private readonly cookieService : CookieService,
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


  isLoggedIn() {
    return (this.readFromCookie(CookieConstants.REFRESH_TOKEN).sub !== '')
  }

  getRole() {
    return this.readFromCookie(CookieConstants.USER_TOKEN).role;
  }

  haveAdminRights() {
    return this.getRole() !== Role.User;
  }

  getMyUserId(): string {
    return this.readFromCookie(CookieConstants.USER_TOKEN).sub;
  }

  logOut(){
    this.cookieService.delete(CookieConstants.USER_TOKEN);
    this.cookieService.delete(CookieConstants.REFRESH_TOKEN);
    window.location.href = `${environment.webUrl}/login`;
  }

  banLogOut(){
    this.cookieService.set(CookieConstants.UNAUTHORIZED_TOKEN,this.readFromCookie(CookieConstants.USER_TOKEN).sub);
    this.logOut();
  }

  refreshTokens(){
    this.cookieService.delete(CookieConstants.USER_TOKEN);
  }

}
