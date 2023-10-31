import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CookieConstants } from '../utils/cookie.constants';
import { environment } from 'src/environments/environment';
import { UsersCache } from '../cache';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  constructor(
    private readonly cachedUsers: UsersCache,
    private auth: AuthService
  ){}
  canActivate(): boolean {
    const checkSession = this.auth.readFromCookie(CookieConstants.USER_TOKEN)
    if (checkSession.sub === ''){
      window.location.href = environment.loginUrl;
      return false;
    }
    if (this.cachedUsers.getMyUserId()!== checkSession.sub) {
      this.cachedUsers.setMyUserId(checkSession.sub);
    }
    return true;
  }
};
