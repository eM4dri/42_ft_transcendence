import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs';
import { Paddle } from '../models';
import { Game } from '../models';

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

  listeningToHelloSignal() {
    return this.mysocket.fromEvent<Paddle>('HelloSignal').pipe(map((data) => data));
  }

  listeningToStatusUpdate() {
    return this.mysocket.fromEvent<Game>('statusUpdate').pipe(map((data) => data));
  }

}
