import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookieConstants, UriConstants } from 'src/app/utils';
import { CookieService } from 'ngx-cookie-service';
import { BaseComponent } from '../shared';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';

export interface PostTokens {
  accessToken: string; 
  refreshToken: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent<{},PostTokens> {
  tfaId: string = '';
  tfaToken: string = '';

  constructor(
    private readonly api: ApiService<{},PostTokens>,
    private readonly cookieService: CookieService,
    private router: Router
  ){ 
    super(api);
    this.tfaId = this.cookieService.get(CookieConstants.TFA_TOKEN);
  }
  
  login(){
    if (this.tfaId===''){
      window.location.href = environment.loginUrl;
    }else {
      this.createService({
        url: `${UriConstants.VALID_TFA}`,
        data: { token: this.tfaToken, userid: this.tfaId }
      }).subscribe({
        next: data => {
          const { accessToken, refreshToken }  = data.response;
          this.cookieService.set(CookieConstants.USER_TOKEN, accessToken);
          this.cookieService.set(CookieConstants.REFRESH_TOKEN, refreshToken);
          this.cookieService.delete(CookieConstants.TFA_TOKEN);
          this.router.navigate(['/home']);
        },
        error: error => {
          this.alertConfiguration('ERROR', error);
          this.openAlert();
          this.loading = false;
        },
      });
    }
  }

}
