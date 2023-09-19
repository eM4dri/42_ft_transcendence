import { 
  Component, 
  // Renderer2 
} from '@angular/core';
import { 
  Router, 
  // ActivatedRoute, 
  // RouterStateSnapshot 
} from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Clash of Pong';
  selectedNavItem: string = 'home';
  dropdownVisibility: boolean = false;

  constructor (
    private router:Router,
    // private route:ActivatedRoute,
    // private _renderer:Renderer2,
    ) {
    }

  darkMode: boolean = true;

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
    this.darkMode = !this.darkMode;
  }


}
