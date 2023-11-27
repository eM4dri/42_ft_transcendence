import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { PongTVService } from 'src/app/services';
import { Router } from '@angular/router';

export interface LiveGame{
  gameId: string,
  user1: User,
  user2: User,
  score1: number,
  score2: number,
  modsenabled: string
}

@Component({
  selector: 'app-spectate',
  templateUrl: './spectate.component.html',
  styleUrls: ['./spectate.component.scss']
})
export class SpectateComponent implements OnInit{

  games:LiveGame[] = [];
  html_nomatches = 1;
  newGame(gameid: string, blueid: string, bluelogin: string, redlogin: string, redid: string, bluescore: number, redscore: number, _modsenabled: boolean) {
    const newGame: LiveGame = {
      gameId: gameid,
      user1:{
        userId: blueid,
        username: bluelogin,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=local${gameid}`
      },
      user2:{
        userId: redid,
        username: redlogin,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=visitor${gameid}`
      },
      score1: bluescore,
      score2: redscore,
      modsenabled: _modsenabled ? "Mods" : "Classic"
    }
    this.games.push(newGame);
  }

    constructor(private readonly pongTVService: PongTVService, private router:Router)
    {

//       this.pongTVService.listeningToGameList().subscribe(gamelist => {
//         console.log('this.pongTVService.listeningToGameList()',gamelist);
//         if (this.games.length > 0)
//           this.games = []
//         gamelist.finalist.forEach((game) => {
//           this.newGame((game.gameid).toString(), game.blueplayer, game.blueplayer, game.redplayer, game.redplayer, game.bluescore, game.redscore)
//         });
//       });

//       this.pongTVService.listeningToGameListUpdate().subscribe(gameitem => {
//         console.log('this.pongTVService.listeningToGameListUpdate()',gameitem);
//         this.games.forEach((game) => {
//           if (game.gameId == gameitem.gameid.toString())
//           {
//             game.score1 = gameitem.bluescore;
//             game.score2 = gameitem.redscore;
// //            game.timeLeft = gameitem.timeleft;
//           }
//         });
//       });

//       this.pongTVService.listeningToCacheUpdate().subscribe(gameitem => {
//         console.log(' this.pongTVService.listeningToCacheUpdate()',gameitem);
//         console.log("cacheupdate")
//         console.log(gameitem)
//         this.games.forEach((game) => {
//           gameitem.forEach((db_userlist) => {
//             if (game.user1.userId == db_userlist.userId)
//             {
//               if (db_userlist.avatar)
//                 game.user1.avatar = db_userlist.avatar;
//               game.user1.username = db_userlist.username;
//             }
//             else if (game.user2.userId == db_userlist.userId)
//             {
//               if (db_userlist.avatar)
//                 game.user2.avatar = db_userlist.avatar;
//               game.user2.username = db_userlist.username;
//             }
//           });
//         });
//       });
//       this.getGameList()
  }

	ngOnInit(): void
	{
    this.pongTVService.listeningToGameList().subscribe(gamelist => {
      console.log('this.pongTVService.listeningToGameList()',gamelist);
      if (this.games.length > 0)
        this.games = []
      gamelist.finalist.forEach((game) => {
        this.newGame((game.gameid).toString(), game.blueplayer, game.blueplayer, game.redplayer, game.redplayer, game.bluescore, game.redscore, game.modsenabled)
      });
      if (gamelist.finalist.length > 0)
        this.html_nomatches = 0;
      else
        this.html_nomatches = 1;

    });

    this.pongTVService.listeningToGameListUpdate().subscribe(gameitem => {
      console.log('this.pongTVService.listeningToGameListUpdate()',gameitem);
      this.games.forEach((game) => {
        if (game.gameId == gameitem.gameid.toString())
        {
          game.score1 = gameitem.bluescore;
          game.score2 = gameitem.redscore;
//            game.timeLeft = gameitem.timeleft;
        }
      });
    });

    this.pongTVService.listeningToCacheUpdate().subscribe(gameitem => {
      console.log(' this.pongTVService.listeningToCacheUpdate()',gameitem);
      console.log("cacheupdate")
      console.log(gameitem)
      this.games.forEach((game) => {
        gameitem.forEach((db_userlist) => {
          if (game.user1.userId == db_userlist.userId)
          {
            if (db_userlist.avatar)
              game.user1.avatar = db_userlist.avatar;
            game.user1.username = db_userlist.username;
          }
          else if (game.user2.userId == db_userlist.userId)
          {
            if (db_userlist.avatar)
              game.user2.avatar = db_userlist.avatar;
            game.user2.username = db_userlist.username;
          }
        });
      });
    });
    this.getGameList()
		console.log("HI :D")
	}

	getGameList()
	{
		this.pongTVService.getGameList()
	}

	spectateGame(item: GameItem)
	{
		alert("Not implemented");
	}

  public joinQueue(): void {
    // Aquí va a tener que ir la lógica de la cola.
    // Hasta que no haya otro usuario en cola se queda esperando a la respuesta
    // (Mostrar Loading por pantalla, cambiar el texto del botón a cancel)
    // Habria que poner la pantalla en loading + opcion de cancelar y salir de la cola
    // Cuando haya 2 jugadores en la cola y matcheen, redirigir al juego con el pong
    // Poner a cada uno en un lado aleatorio de la pantalla
    this.router.navigate(['/game']);
  }

}


class GameList {
	finalist: Array<GameItem> = []
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