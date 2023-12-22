import { Injectable } from '@angular/core';
import { MySocket } from './web-socket.service';
import { map } from 'rxjs';
import { Game } from '../models';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PongTVService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  getGameList() {
    this.mysocket.emit('getgamelist');
  }



  listeningToGameList() {
    return this.mysocket.fromEvent<GameList>('gamelist').pipe(map((data) => data));
  }

  listeningToGameListUpdate() {
    return this.mysocket.fromEvent<GameItem>('gameupdate').pipe(map((data) => data));
  }
  
  listeningToCacheUpdate() {
    return this.mysocket.fromEvent<User[]>('individual_users_to_cache').pipe(map((data) => data));
  }

  listeningToGameNotFound() {
    return this.mysocket.fromEvent<void>('gamenotfound').pipe(map((data) => data));
  }
}

class GameList {
	finalist: Array<GameItem> = []
  test: string = "wewrsgtdfh"
}

class GameItem {
	gameid: number = 0;
	blueplayer: string = "";
	redplayer: string = "";
	bluescore: number = 0;
	redscore: number = 0;
	timeleft: number = 0;
	roomname: string = "";
  modsenabled: boolean = false
}