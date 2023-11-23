import { Component } from '@angular/core';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  darkMode: boolean = true;
  constructor(
    private readonly authService: AuthService
  ){ }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
