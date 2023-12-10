import { Component } from '@angular/core';
import { AuthService, UserService } from './services';
import { ChannelsCache, ChatsCache, UsersCache } from './cache';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme: string = 'dark';
  constructor(
    private readonly cachedChats: ChatsCache,
    private readonly cachedChannels: ChannelsCache,
    private readonly cachedUsers: UsersCache,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ){
      this.userService.clientReady();
      this.theme = localStorage.getItem('theme') || 'dark';
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
