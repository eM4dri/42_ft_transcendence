import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService, UserService } from 'src/app/services';
import { CookieConstants } from 'src/app/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor (
    private router: Router, 
    private cookieService: CookieService,
    private userService: UserService
    ) {
      this.cookieService.delete(CookieConstants.TFA_TOKEN);
      this.userService.clientReady();
      this.router.navigate(['/game']);
    }

}
