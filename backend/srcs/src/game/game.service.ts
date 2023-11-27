import { Injectable } from '@nestjs/common';
import { Historic_GameDto } from '../historic_games/dto';
import { HistoricGamesController } from '../historic_games/historic_games.controller'
import { HistoricGamesService } from '../historic_games/historic_games.service'
import { PrismaService } from "../prisma/prisma.service";
import { Server, Socket } from 'socket.io';
import { WsResponse, WebSocketServer } from '@nestjs/websockets';
import { StatsService } from '../stats/stats.service'
import { Update_statsDto } from 'src/stats/dto';


var ball_radius: number = 5;
var paddle_radius: number = 10;
var paddle_distanceToMargin: number = 5;
var refreshRate = 20;		// How often the game is refreshed (in ms)

//?		~~~~~		~~~~~

enum gameStatus
{
	none = 0,		//*	0
	pregame,		//*	1
	ballfalling,	//*	2
	goalanimation,	//*	3
	postgame,		//*	4
	disconnect_hold,//*	5
	gameout,		//*	6
	game = 42		//*	42
}

export class Ball
{
	x: number = 100;		//	← 0  |  200 →
	y: number = 50;			//	↑ 0  |  100 ↓
	speed: number = 1;		
	angle: number = 60;		// -90 ↑  |  0 ⭤  |  90 ↓ (0's direction gets decided by the parameter below. Don't let the angle be >= 90 || <= -90)
	direction: number = -1;	//  -1 ←  |  1 →
	radius: number = 5;		// 5% of the field.
	passedLimit: boolean = false;
}

export class Paddle
{
	y: number = 50;			//	↑ 0  |  100 ↓ (y value is the middle point of the paddle)
	direction: number = 0;
	radius: number = 10;	//	height = radius * 2
}

export class Game
{
	id: number;
	blueid: string;
	redid: string;
	room: string;
	ball: Ball;
	redpaddle: Paddle;
	redscore: number = 0;
	bluepaddle: Paddle;
	bluescore: number = 0;
	bluesocket: Socket;
	redsocket: Socket;
	gametime: number = 120000;	// Time in ms
	modsenabled: boolean = false;
	constructor(newid: number, _blueid: string, _redid: string, _room: string, _bluesocket: Socket, _redsocket: Socket)
	{
		this.id = newid;
		this.blueid = _blueid;
		this.redid = _redid;
		this.room = _room;
		this.bluesocket = _bluesocket;
//		console.log(this.bluesocket)
		this.redsocket = _redsocket;
//		console.log(this.bluesocket)
		this.redpaddle = new Paddle;
		this.bluepaddle = new Paddle;
		this.ball = new Ball;
	}
	status: number = gameStatus.pregame;
	waitEnd: number = 0;
	blueserve: boolean = false; //?		true: blue's serving  |  false: red's serving
}

class GameZIP
{
	id: number;
	blueid: string;
	redid: string;
	room: string;
	ball: Ball;
	redpaddle: Paddle;
	bluepaddle: Paddle;
	redscore: number = 0;
	bluescore: number = 0;
	gametime: number = 120000;	// Time in ms
	modsenabled: boolean = false;
	constructor(orig: Game)
	{
		this.id = orig.id;
		this.blueid = orig.blueid;
		this.redid = orig.redid;
		this.room = orig.room;
		this.bluepaddle = orig.bluepaddle;
		this.redpaddle = orig.redpaddle;
		this.ball = orig.ball;
		this.bluescore = orig.bluescore;
		this.redscore = orig.redscore;
		this.gametime = orig.gametime;
	}
	status: number = gameStatus.pregame;
	waitEnd: number = 0;
}

class GameList {
	finalist: Array<GameItem>
	test: string
	constructor(themap: Map<number, Game>)
	{
		this.finalist = []
		this.test = "(1)"
//		this.finalist.push(new GameItem(8766, "I'm BLUE", "I'm RED", 2, 4, 87, "roooommmm"))	//! DELETE
		themap.forEach((value: Game, key: number) =>
		{
			this.finalist.push(new GameItem(key, value.blueid, value.redid, value.bluescore, value.redscore, value.gametime, value.room, value.modsenabled))
		})
	}
}

class GameItem {
	gameid: number;
	blueplayer: string;
	redplayer: string;
	bluescore: number;
	redscore: number;
	timeleft: number;
	roomname: string;
	modsenabled: boolean;

	constructor(_gameid: number, _blueplayer: string, _redplayer: string, _bluescore: number, _redscore: number, _timeleft: number, _roomname: string, _modsenabled: boolean)
	{
		this.gameid = _gameid;
		this.blueplayer = _blueplayer;
		this.redplayer = _redplayer;
		this.bluescore = _bluescore;
		this.redscore = _redscore;
		this.timeleft = _timeleft;
		this.roomname = _roomname;
		this.modsenabled = _modsenabled;
	}
}

@Injectable()
export class GameService {
	allgames = new Map<number, Game>();
	constructor(private readonly historicGamesService: HistoricGamesService, private readonly statsService: StatsService){
		// this.allgames.set(new, new Game(newuid))
	}

	public	createMatch(blueid: string, redid: string, room: string, bluesocket: Socket, redsocket: Socket)
	{
		
		let newuid = Math.round(Math.random() * 100000);
		
		this.allgames.set(newuid, new Game(newuid, blueid, redid, room, bluesocket, redsocket))
		
	}
	
	public  mainLoop(server: Server): Map<number, Game>
	{
		let current_time: number = Date.now();
		this.allgames.forEach((value: Game, key: number) =>
		{
			
			if (value.waitEnd >= current_time)		//?		Waiting for something. Wait hasn't ended yet.
			{
				
				if (value.status != gameStatus.none && value.status != gameStatus.pregame && value.status != gameStatus.postgame)
				{
					if (value.bluepaddle.y + value.bluepaddle.direction >= paddle_radius && value.bluepaddle.y + value.bluepaddle.direction <= 100 - paddle_radius)
						value.bluepaddle.y += value.bluepaddle.direction;
					if (value.redpaddle.y + value.redpaddle.direction >= paddle_radius && value.redpaddle.y + value.redpaddle.direction <= 100 - paddle_radius)
						value.redpaddle.y += value.redpaddle.direction;
					server.to(value.room).emit('statusUpdate', new GameZIP(value))
				}
				return ;
			}
			else	//?		Either wait just ended or wasn't waiting
			{
				
				if (value.status == gameStatus.ballfalling)	//?		Ball finished falling, game begins/resumes
				{
					value.status = gameStatus.game;
					value.waitEnd = 0;
				}
				else if (value.status == gameStatus.goalanimation)	//?		Goal animation finished. Ball drops for one second
				{
					value.status = gameStatus.ballfalling;
					value.waitEnd = current_time + 1000;
				}
				else if (value.status == gameStatus.pregame)	//?		Pre-game animation ended. Ball drops for one second
				{
					value.status = gameStatus.ballfalling;
					value.waitEnd = current_time + 1000;
				}
				else if (value.status == gameStatus.postgame)	//?		Game ended.
				{
					value.status = gameStatus.gameout;
					// const historicService: HistoricGamesService = new HistoricGamesService(new PrismaService);
					const newHistoricGame: Historic_GameDto = {
						localId: value.blueid,
						visitorId: value.redid,
						localGoals: value.bluescore,
						visitorGoals: value.redscore,
						winLocal: value.bluescore > value.redscore,
						winVisitor: value.bluescore < value.redscore,
						draw: value.bluescore == value.redscore,
						pointsLocal: 50 * (value.bluescore > value.redscore ? 1 : 0) + 20 * (value.bluescore == value.redscore ? 1 : 0) + value.bluescore,
						pointsVisitor: 50 * (value.redscore > value.bluescore ? 1 : 0) + 20 * (value.redscore == value.bluescore ? 1 : 0) + value.redscore
					}
					
					this.historicGamesService.post_historic(newHistoricGame);
					
					const newStat_blue: Update_statsDto = {
						userId: value.blueid,
						win: value.bluescore > value.redscore,
						lose: value.bluescore < value.redscore,
						draw: value.bluescore == value.redscore,
						goalsFavor: value.bluescore,
						goalsAgainst: value.redscore,
						disconect: false, //! No idea what this does. Also, typo X(
						points: 50 * (value.bluescore > value.redscore ? 1 : 0) + 20 * (value.bluescore == value.redscore ? 1 : 0) + value.bluescore

					}
					this.statsService.update_stats(newStat_blue);
					
					const newStat_red: Update_statsDto = {
						userId: value.redid,
						win: value.bluescore < value.redscore,
						lose: value.bluescore > value.redscore,
						draw: value.bluescore == value.redscore,
						goalsFavor: value.redscore,
						goalsAgainst: value.bluescore,
						disconect: false, //! No idea what this does. Also, typo X(
						points: 50 * (value.bluescore < value.redscore ? 1 : 0) + 20 * (value.bluescore == value.redscore ? 1 : 0) + value.redscore

					}
					this.statsService.update_stats(newStat_red);
					
					//?		see POST /historic-games in localhost:3000
					//?		backend/srcs/src/historic_games/historic_games.controller.ts -> L74
					this.allgames.delete(key);
					server.to("all_spectators").emit('gamelist', new GameList(this.allgames))
					return;
				}
			}
			
			if (value.status == gameStatus.game)	//?		Ongoing game
			{
				value.ball.x += value.ball.speed * Math.cos(value.ball.angle * Math.PI / 180) * value.ball.direction;	//?	Calculating new position for this frame
				value.ball.y += value.ball.speed * Math.sin(value.ball.angle * Math.PI / 180);
				value.gametime -= refreshRate;
				if (value.ball.y - ball_radius <= 0 || value.ball.y + ball_radius >= 100)
				{
					//?		Bounced with a wall
					value.ball.angle *= -1; 
				}
				if (value.ball.x - ball_radius <= paddle_distanceToMargin && !value.ball.passedLimit)		//? If ball touched the limit line on the left side
				{
					if (value.bluepaddle.y - value.bluepaddle.radius <= value.ball.y + value.ball.radius && value.bluepaddle.y + value.bluepaddle.radius >= value.ball.y - value.ball.radius)
					{
						// console.log("🔷 BOUNCE BLUE 🔷")
						value.ball.direction = 1;
						value.ball.passedLimit = false;
						value.ball.angle = 50 * ((value.ball.y - value.bluepaddle.y) / (value.bluepaddle.radius))
					}
					else
					{
						value.ball.passedLimit = true;
					}
				}
				else if (value.ball.x + ball_radius >= 200 - paddle_distanceToMargin && !value.ball.passedLimit)		//? If ball touched the limit line on the right side
				{
					if (value.redpaddle.y - value.redpaddle.radius <= value.ball.y + value.ball.radius && value.redpaddle.y + value.redpaddle.radius >= value.ball.y - value.ball.radius)
					{
						// console.log("♦️ BOUNCE RED ♦️")		//?		Ball touched the paddle
						value.ball.direction = -1;
						value.ball.passedLimit = false;
						value.ball.angle = 50 * ((value.ball.y - value.redpaddle.y) / (value.redpaddle.radius))
					}
					else		//?		The ball didn't touch the paddle so scoring is now unavoidable.
					{
						value.ball.passedLimit = true;
					}
				}
				else if (value.ball.x - ball_radius <= 0)	//?	Red scored on blue's side
				{
					// console.log("❤️❤️❤️ GOAAAALLLL ❤️❤️❤️")
					value.status = gameStatus.goalanimation;
					value.redscore += 1;
					value.waitEnd = current_time + 2000;
					value.ball.x = 100;
					value.ball.y = 50;
					if (value.blueserve)
					value.ball.direction = -1;
					else
					value.ball.direction = 1;
					value.blueserve = !value.blueserve
					value.ball.angle = Math.round((Math.random() - 0.5) * 120);
					server.to("all_spectators").emit('gameupdate', new GameItem(value.id, value.blueid, value.redid, value.bluescore, value.redscore, value.gametime, value.room, value.modsenabled))
				}
				else if (value.ball.x + ball_radius >= 200)	//?	Blue scored on red's side
				{
					//!		Send GOAL signal
					// console.log("💙💙💙 GOAAAALLLL 💙💙💙")
					value.status = gameStatus.goalanimation;
					value.bluescore += 1;
					value.waitEnd = current_time + 2000;
					value.ball.x = 100;
					value.ball.y = 50;
					if (value.blueserve)
					value.ball.direction = -1;
					else
					value.ball.direction = 1;
					value.blueserve = !value.blueserve
					value.ball.angle = Math.round((Math.random() - 0.5) * 120);
					server.to("all_spectators").emit('gameupdate', new GameItem(value.id, value.blueid, value.redid, value.bluescore, value.redscore, value.gametime, value.room, value.modsenabled))
				}
				else
					value.ball.passedLimit = false;
				
				//?		Moving the paddles according to their `direction` value (-1, 0, 1).
				if (value.bluepaddle.y + value.bluepaddle.direction >= paddle_radius && value.bluepaddle.y + value.bluepaddle.direction <= 100 - paddle_radius)
					value.bluepaddle.y += value.bluepaddle.direction;
				if (value.redpaddle.y + value.redpaddle.direction >= paddle_radius && value.redpaddle.y + value.redpaddle.direction <= 100 - paddle_radius)
					value.redpaddle.y += value.redpaddle.direction;
			}
			
			if (value.gametime <= 0)	//?		Game ended from timeout.
			{
				// console.log("🏁 🏁 TIME'S UP: Game Ended 🏁 🏁")
				value.status = gameStatus.postgame;
			}
			// console.log("🟦", value.bluepaddle.y, "(", value.bluepaddle.direction, ")   |   🟥", value.redpaddle.y, "(", value.redpaddle.direction, ")")
			// console.log("🟠", value.ball.x, value.ball.y, value.ball.angle, value.ball.direction)
			// console.log("GAME STATUS:", value.status, " |  Time Left:", Math.round(value.gametime / 1000))
////			if (value.status != gameStatus.gameout)
			
			server.to(value.room).emit('statusUpdate', new GameZIP(value))	//?		Sending the status of the game to the clients to update their info.
			
		});
		return (this.allgames)
	}
}

// /goinfre/jvacaris/TRANSCENDENCE/backend/srcs/src/game/game.service.ts:80
//     allgames.forEach((value: Game, key: number) =>
//            ^
// TypeError: Cannot read properties of undefined (reading 'post_historic_game')
//     at /goinfre/jvacaris/TRANSCENDENCE/backend/srcs/src/game/game.service.ts:129:20
//     at Map.forEach (<anonymous>)
//     at GameService.mainLoop (/goinfre/jvacaris/TRANSCENDENCE/backend/srcs/src/game/game.service.ts:80:12)
//     at Timeout._onTimeout (/goinfre/jvacaris/TRANSCENDENCE/backend/srcs/src/game/game.gateway.ts:38:37)
//     at listOnTimeout (node:internal/timers:573:17)
//     at processTimers (node:internal/timers:514:7)