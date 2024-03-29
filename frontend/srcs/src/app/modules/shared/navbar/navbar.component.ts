import {
  Component,
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services';
import { ChallengeService } from 'src/app/services/challenge.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private readonly router: Router,
    public readonly appComponent: AppComponent,
    private readonly authService: AuthService,
    private readonly challengeService: ChallengeService
  ) { }

  title: string = 'Clash of Pong';
  selectedNavItem: string = 'home';
  dropdownVisibility: boolean = false;

  get isRootComponent(): boolean {
    return this.router.routerState.snapshot.url === "/";
  }

  public goToLogin(): void {
    window.location.href = environment.loginUrl;
  }

  public goToHome(): void {
    this.selectedNavItem = 'home';
    this.router.navigate(['/home']);
  }

  public goToHistory(): void {
    this.selectedNavItem = 'history';
    this.router.navigate(['/history']);
  }

  public goToProfile(): void {
    this.selectedNavItem = 'profile';
    this.dropdownVisibility = false;
    this.router.navigate(['/profile']);
  }

  public goToRank(): void {
    this.selectedNavItem = 'rank';
    this.router.navigate(['/rank']);
  }

  public openChat(): void {
    this.selectedNavItem = 'chat';
    this.router.navigate(['/chat']);
  }

  public openAdministration(): void {
    this.selectedNavItem = 'administration';
    this.router.navigate(['/administration']);
  }

  public openSpectate(): void {
    this.selectedNavItem = 'live';
    this.router.navigate(['/live']);
  }

  public openFriendsList(): void {
    this.selectedNavItem = 'friends';
    this.router.navigate(['/friends']);
  }

  public toggleDropdown(): void {
    this.dropdownVisibility = !this.dropdownVisibility;
  }

  public changeVisibility(): void {
    if (this.appComponent.theme !== 'dark') {
      this.appComponent.theme = 'dark';
    } else {
      this.appComponent.theme = 'light';
    }
    localStorage.setItem('theme', this.appComponent.theme);
    this.challengeService.sendThemeSub(this.appComponent.theme);
  }

  public isAdmin() {
    return this.authService.haveAdminRights();
  }

  public logOut() {
    return this.authService.logOut();
  }

}
