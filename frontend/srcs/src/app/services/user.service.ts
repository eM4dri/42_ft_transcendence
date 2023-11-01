import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  clientReady() {
    this.mysocket.emit('client_ready');
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



