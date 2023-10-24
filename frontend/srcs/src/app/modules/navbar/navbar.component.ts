import { 
  Component, 
} from '@angular/core';
import { 
  Router, 
} from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor (
    private router:Router,
    public readonly appComponent :AppComponent
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
    this.selectedNavItem = '';
    this.dropdownVisibility = false;
    this.router.navigate(['/profile']);
  }

  public openChat(): void {
    this.selectedNavItem = 'chat';
    this.router.navigate(['/chat']);
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

}
