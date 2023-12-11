import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GameUser } from '../models';

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

  cancelChallenge(userId: string) {
    this.mysocket.emit('cancel_challenge', userId);
  }

  hereComesANewChallenger(userId: string) {
    return this.mysocket.fromEvent<string>(`here_comes_a_new_challenger_for_${userId}`).pipe(map((data) => data));
  }

  clearChallenges() {
    return this.mysocket.fromEvent<string>('clear_challenges').pipe(map((data) => data));
  }

  usersStartPlaying() {
    return this.mysocket.fromEvent<GameUser>('user_start_playing').pipe(map((data) => data));
  }

  usersStopPlaying() {
    return this.mysocket.fromEvent<string[]>('users_stop_playing').pipe(map((data) => data));
  }

  startChallenge_front() {
    return this.mysocket.fromEvent<boolean>('start_challenge').pipe(map((data) => data));
  }

  private challengingUserIdSub = new Subject<string>();
  sendChallengingUserIdSub(challengingUserId: string) {
      this.challengingUserIdSub.next(challengingUserId);
  }
  getChallengingUserIdSub() {
    return this.challengingUserIdSub.asObservable();
  }  

  private themeSub = new Subject<string>();
  sendThemeSub(theme: string) {
      this.themeSub.next(theme);
  }
  getThemeSub() {
    return this.themeSub.asObservable();
  }  

}

