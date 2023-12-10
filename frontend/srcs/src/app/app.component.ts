import { Component } from '@angular/core';
import { AuthService, UserService } from './services';
import { ChannelsCache, ChatsCache, UsersCache } from './cache';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  darkMode: boolean = true;
  theme: string = localStorage.getItem('theme') || 'dark';
  constructor(
    private readonly cachedChats: ChatsCache,
    private readonly cachedChannels: ChannelsCache,
    private readonly cachedUsers: UsersCache,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ){ 
    this.userService.clientReady();
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
