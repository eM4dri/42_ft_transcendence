import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  challenge(userId: string) {
    this.mysocket.emit('challenge', userId);
  }

  rejectChallenge(userId: string) {
    this.mysocket.emit('reject_challenge', userId);
  }

  acceptChallenge(userId: string) {
    this.mysocket.emit('accept_challenge', userId);
  }

  hereComesANewChallenger() {
    return this.mysocket.fromEvent<string>('here_comes_a_new_challenger').pipe(map((data) => data));
  }

}



