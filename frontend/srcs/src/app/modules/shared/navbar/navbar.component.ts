import { 
  Component, 
} from '@angular/core';
import { 
  Router, 
} from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor (
    private readonly router:Router,
    public readonly appComponent: AppComponent,
    private readonly authService: AuthService
    ) {   }
    
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

  public toggleDropdown(): void {
    this.dropdownVisibility = !this.dropdownVisibility;
  }

  public diHola(): void {
    console.log("hola");
  }

  public changeVisibility(): void {
    this.appComponent.darkMode = !this.appComponent.darkMode;
  }

  public isAdmin() {
    return this.authService.haveAdminRights();
  }

  public logOut() {
    return this.authService.logOut();
  }

}
