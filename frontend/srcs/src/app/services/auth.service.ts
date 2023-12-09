import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
import { AuthModel } from '../models/core/auth.model';
import { CookieService } from 'ngx-cookie-service';
import { CookieConstants } from '../utils';
import { Role } from '../models';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;
  // roleAs: string = 'USER';
  constructor(
    private readonly cookieService : CookieService,
    private router: Router
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
    this.router.navigate(['/login']);
  }

  refreshTokens(){
    this.cookieService.delete(CookieConstants.USER_TOKEN);
  }

}
