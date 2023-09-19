import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionStorageConstants } from '../utils/session.storage';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  constructor(
    private readonly router: Router,
    private auth: AuthService
  ){}
  canActivate(): boolean {
    const checkSession = this.auth.readFromCookie(SessionStorageConstants.USER_TOKEN)
    if (checkSession.sub === ''){
      window.location.href = environment.loginUrl;
      return false;
    }
    return true;
  }
};
