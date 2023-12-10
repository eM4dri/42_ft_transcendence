import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs/operators';
import { User } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  clientIsReady: boolean = false;
  constructor(
    private readonly mysocket: MySocket,
    private authService: AuthService
  ) { }

  clientReady() {
    if (!this.clientIsReady && this.authService.isLoggedIn()) {
      this.mysocket.emit('client_ready');
      this.clientIsReady = true;
    }
  }

  blockedUserIds() {
    return this.mysocket.fromEvent<string[]>('blocked_userids').pipe(map((data) => data));
  }

  friendUserIds() {
    return this.mysocket.fromEvent<string[]>('friend_userids').pipe(map((data) => data));
  }

  usersConnected() {
    return this.mysocket.fromEvent<string[]>('users_connected').pipe(map((data) => data));
  }

  userDisconnects() {
    return this.mysocket.fromEvent<string>('user_disconnects').pipe(map((data) => data));
  }

  userConnects() {
    return this.mysocket.fromEvent<string>('user_connects').pipe(map((data) => data));
  }

  usersToCache() {
    return this.mysocket.fromEvent<User[]>('users_to_cache').pipe(map((data) => data));
  }

}



