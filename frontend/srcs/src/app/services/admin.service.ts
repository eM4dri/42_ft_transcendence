import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  userBanned() {
    return this.mysocket.fromEvent<string>('user_banned').pipe(map((data) => data));
  }

  userPromoted() {
    return this.mysocket.fromEvent<string>('user_promoted').pipe(map((data) => data));
  }

  userDemoted() {
    return this.mysocket.fromEvent<string>('user_demoted').pipe(map((data) => data));
  }
}