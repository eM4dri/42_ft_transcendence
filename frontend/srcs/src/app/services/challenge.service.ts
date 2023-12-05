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

  challengeUserId(userId: string) {
    this.mysocket.emit('challenge_userid', userId);
  }

  rejectChallenge(userId: string) {
    this.mysocket.emit('reject_challenge', userId);
  }

  acceptChallenge(userId: string) {
    this.mysocket.emit('accept_challenge', userId);
  }

  hereComesANewChallenger(userId: string) {
    return this.mysocket.fromEvent<string>(`here_comes_a_new_challenger_for_${userId}`).pipe(map((data) => data));
  }

  startChallenge_front() {
    return this.mysocket.fromEvent<boolean>('challengeStart').pipe(map((data) => data));
  }


}



