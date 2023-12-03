import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs';
import { Paddle } from '../models';
import { Game } from '../models';
import { GameResult } from '../models/game/gameresult.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  sendKeyPress(msg: number) {
    this.mysocket.emit('keypressed', msg);
  }

  sendMatchOngoing() {
    this.mysocket.emit('matchongoing');
  }

  playbutton(ismodded: number) {
    this.mysocket.emit('matchmaking', ismodded == 0 ? false : true)
  }

  cancelmatchmaking() {
    this.mysocket.emit('cancelmatchmaking')
  }

  sendWannaWatch(gameid: number){
    this.mysocket.emit('wannawatch', gameid)
  }

  sendDontWannaWatch(){
    this.mysocket.emit('dontwannawatch')
  }

  sendDisconnected() {
    this.mysocket.emit('disconnectedFromGame');
  }

  listeningToHelloSignal() {
    return this.mysocket.fromEvent<Paddle>('HelloSignal').pipe(map((data) => data));
  }

  listeningToStatusUpdate() {
    return this.mysocket.fromEvent<Game>('statusUpdate').pipe(map((data) => data));
  }

  listeningToGameResult() {
    return this.mysocket.fromEvent<GameResult>('gameresult').pipe(map((data) => data));
  }

  listeningToTeamBlue() {
    return this.mysocket.fromEvent<boolean>('teamblue').pipe(map((data) => data));
  }

}
