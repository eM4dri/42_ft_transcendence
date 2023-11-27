import { Component, OnInit, NgModule } from '@angular/core';
import { AuthService } from 'src/app/services';
import { PongTVService } from 'src/app/services'
import { Game } from '../game/game.classes';

/*
@Component({
	selector: 'app-pongtv',
	templateUrl: './pongtv.component.html',
	styleUrls: ['./pongtv.component.scss']
})
export class PongTVComponent implements OnInit
{
	gameshtml: any[] = []
	constructor(private readonly pongTVService: PongTVService)
	{
		this.getGameList()
		console.log("(4)")
		this.pongTVService.listeningToGameList().subscribe(gamelist => {
			if (this.gameshtml.length > 0)
				this.gameshtml = []
			gamelist.finalist.forEach((game) => {
				this.gameshtml.push({ playerblue: game.blueplayer, scoreblue: game.bluescore, scorered: game.redscore, playerred: game.redplayer, TimeLeft: game.timeleft, gameid: game.gameid})
			});
		});
		this.pongTVService.listeningToGameListUpdate().subscribe(gameitem => {
			console.log("(5)")
			this.gameshtml.forEach((game) => {
				if (game.gameid == gameitem.gameid)
				{
					console.log("HII");
					game.scoreblue = gameitem.bluescore;
					game.scorered = gameitem.redscore;
					game.timeLeft = gameitem.timeleft;
				}
			});
		});
	}

	ngOnInit(): void
	{
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
}*/