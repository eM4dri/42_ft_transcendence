import { Injectable } from '@nestjs/common';
import { Historic_GameDto } from '../historic_games/dto';
import { HistoricGamesController } from '../historic_games/historic_games.controller'
import { HistoricGamesService } from '../historic_games/historic_games.service'
import { PrismaService } from "../prisma/prisma.service";
import { Server, Socket } from 'socket.io';
import { WsResponse, WebSocketServer } from '@nestjs/websockets';
import { StatsService } from '../stats/stats.service'
import { Update_statsDto } from 'src/stats/dto';
import { stat } from 'fs';
import { stats_user } from "@prisma/client";
import { EventEmitter2 } from '@nestjs/event-emitter';

var ball_radius: number = 5;
var paddle_radius: number = 10;
var paddle_distanceToMargin: number = 5;
var ball_normal_speed: number = 1.75;	//! To change the default ball speed
var refreshRate = 20;		// How often the game is refreshed (in ms)

//?		~~~~~		~~~~~

enum gameStatus
{
	none = 0,		//*	0
	pregame,		//*	1
	ballfalling,	//*	2
	goalanimation_blue,	//*	3
	goalanimation_red,	//*	4
	postgame,		//*	5
	disconnect_hold,//*	6
	gameout,		//*	7
	game = 42		//*	42
}

export class Ball
{
	x: number = 100;		//	← 0  |  200 →
	y: number = 50;			//	↑ 0  |  100 ↓
	speed: number = ball_normal_speed;		
	angle: number = 60;		// -90 ↑  |  0 ⭤  |  90 ↓ (0's direction gets decided by the parameter below. Don't let the angle be >= 90 || <= -90)
	direction: number = -1;	//  -1 ←  |  1 →
	radius: number = 5;		// 5% of the field.
	passedLimit: boolean = false;
	opacity: number = 1;
	invis_len: number = 0;
	just_collided: boolean = false;
}

export class Paddle
{
	y: number = 50;			//	↑ 0  |  100 ↓ (y value is the middle point of the paddle)
	direction: number = 0;
	readonly usual_radius: number = 10;
	radius: number = this.usual_radius;	//	height = radius * 2
}

export class Powerup
{
	x: number = 100;		//	← 0  |  200 →
	y: number = 50;			//	↑ 0  |  100 ↓
	speed: number = 0;	
	spawntime: number = 0;
	type: number = 1;		//	1: Speed
	visible: boolean = false;
}

export class Game
{
	id: number;
	blueid: string;
	redid: string;
	bluename: string;
	redname: string;
	room: string;
	ball: Ball;
	powerup: Powerup;
	redpaddle: Paddle;
	redscore: number = 0;
	bluepaddle: Paddle;
	bluescore: number = 0;
	bluesocket: Socket;
	redsocket: Socket;
	gametime: number = 60000;	// Time in ms
	modsenabled: boolean;
	prev_blue_stats: stats_user;
	prev_red_stats: stats_user;
	spectators: number = 0;
	friendlygame: boolean = false;
	constructor(newid: number, _blueid: string, _redid: string, _room: string, _waitEnd: number, _bluesocket: Socket, _redsocket: Socket, ismodded: boolean, prev_blue: stats_user, prev_red: stats_user, friendlygame: boolean)
	{
		this.id = newid;
		this.blueid = _blueid;
		this.redid = _redid;
		this.bluename = prev_blue.login;
		this.redname = prev_red.login;
		this.room = _room;
		this.waitEnd = _waitEnd;
		this.bluesocket = _bluesocket;
//		console.log(this.bluesocket)
		this.redsocket = _redsocket;
//		console.log(this.bluesocket)
		this.redpaddle = new Paddle;
		this.bluepaddle = new Paddle;
		this.ball = new Ball;
		this.powerup = new Powerup;
		this.modsenabled = ismodded;
		this.prev_blue_stats = prev_blue;
		this.prev_red_stats = prev_red;
		this.friendlygame = friendlygame;

	}
	status: number = gameStatus.pregame;
	waitEnd: number = 6000;
	blueserve: boolean = false; //?		true: blue's serving  |  false: red's serving
}

class GameZIP
{
	id: number;
	blueid: string;
	redid: string;
	bluename: string;
	redname: string;
	room: string;
	ball: Ball;
	powerup: Powerup;
	redpaddle: Paddle;
	bluepaddle: Paddle;
	redscore: number = 0;
	bluescore: number = 0;
	gametime: number = 120000;	// Time in ms
	modsenabled: boolean;
	status: number = gameStatus.pregame;
	waitEnd: number = 6000;
	spectators: number;
	friendlygame: boolean;
	constructor(orig: Game)
	{
		this.id = orig.id;
		this.blueid = orig.blueid;
		this.redid = orig.redid;
		this.bluename = orig.bluename;
		this.redname = orig.redname;
		this.room = orig.room;
		this.bluepaddle = orig.bluepaddle;
		this.redpaddle = orig.redpaddle;
		this.ball = orig.ball;
		this.powerup = orig.powerup;
		this.bluescore = orig.bluescore;
		this.redscore = orig.redscore;//
		this.gametime = orig.gametime;
		this.modsenabled = orig.modsenabled;
		this.status = orig.status;
		this.waitEnd = orig.waitEnd - Date.now();
		this.spectators = orig.spectators;
		this.friendlygame = orig.friendlygame;
	}
}

class GameResult {
	yourscore: number;
	theirscore: number;
	prev_points: number;
	earned_points: number;
	are_you_blue: boolean;
	constructor (_yourscore: number, _theirscore: number, _prev_points: number, _earned_points: number, _are_you_blue: boolean)
	{
		this.yourscore = _yourscore;
		this.theirscore = _theirscore;
		this.prev_points = _prev_points;
		this.earned_points = _earned_points;
		this.are_you_blue = _are_you_blue;
	}
}

class GameList {
	finalist: Array<GameItem>
	test: string
	constructor(themap: Map<number, Game>)
	{
		this.finalist = []
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
	constructor(
		private readonly historicGamesService: HistoricGamesService, 
		private readonly statsService: StatsService,
		private readonly eventemitter: EventEmitter2
		){
		// this.allgames.set(new, new Game(newuid))
	}

	public	createMatch(blueid: string, redid: string, room: string, bluesocket: Socket, redsocket: Socket, ismodded: boolean, prev_blue: stats_user, prev_red: stats_user, friendlygame: boolean)
	{
		let current_time: number = Date.now();
		let newuid:number = Math.round(Math.random() * 100000);

		this.eventemitter.emit('addUserIdsPlaying',[blueid, redid], newuid);
		this.allgames.set(newuid, new Game(newuid, blueid, redid, room, current_time + 6000, bluesocket, redsocket, ismodded, prev_blue, prev_red, friendlygame))
		bluesocket.emit('teamblue', true)
		redsocket.emit('teamblue', false)
	}

	public  mainLoop(server: Server): Map<number, Game>
	{
		let current_time: number = Date.now();
		this.allgames.forEach((value: Game, key: number) =>
		{
			value.ball.just_collided = false;
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
				else if (value.status == gameStatus.postgame || value.status == gameStatus.pregame)
					server.to(value.room).emit('statusUpdate', new GameZIP(value))
				return ;
			}
			else	//?		Either wait just ended or wasn't waiting
			{
				
				if (value.status == gameStatus.ballfalling)	//?		Ball finished falling, game begins/resumes
				{
					value.status = gameStatus.game;
					value.waitEnd = 0;
				}
				else if (value.status == gameStatus.goalanimation_blue || value.status == gameStatus.goalanimation_red)	//?		Goal animation finished. Ball drops for one second
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
						pointsLocal: value.friendlygame ? 0 : (50 * (value.bluescore > value.redscore ? 1 : 0) + 20 * (value.bluescore == value.redscore ? 1 : 0) + value.bluescore),
						pointsVisitor: value.friendlygame ? 0 : (50 * (value.redscore > value.bluescore ? 1 : 0) + 20 * (value.redscore == value.bluescore ? 1 : 0) + value.redscore),
						modded: value.modsenabled,
						competitive: !value.friendlygame,
					}
					
					this.historicGamesService.post_historic(newHistoricGame);
					
					const newStat_blue: Update_statsDto = {
						userId: value.blueid,
						win: value.bluescore > value.redscore,
						lose: value.bluescore < value.redscore,
						draw: value.bluescore == value.redscore,
						goalsFavor: value.bluescore,
						goalsAgainst: value.redscore,
						disconect: false,
						points: value.friendlygame ? 0 : (50 * (value.bluescore > value.redscore ? 1 : 0) + 20 * (value.bluescore == value.redscore ? 1 : 0) + value.bluescore)

					}
					this.statsService.update_stats(newStat_blue);
					
					const newStat_red: Update_statsDto = {
						userId: value.redid,
						win: value.bluescore < value.redscore,
						lose: value.bluescore > value.redscore,
						draw: value.bluescore == value.redscore,
						goalsFavor: value.redscore,
						goalsAgainst: value.bluescore,
						disconect: false,
						points: value.friendlygame ? 0 : (50 * (value.bluescore < value.redscore ? 1 : 0) + 20 * (value.bluescore == value.redscore ? 1 : 0) + value.redscore)

					}
					this.statsService.update_stats(newStat_red);
					this.eventemitter.emit('deleteUserIdsPlaying',[value.redid, value.blueid]);
					
					value.bluesocket.emit('gameresult', new GameResult(value.bluescore, value.redscore, value.prev_blue_stats.points, newStat_blue.points, true))
					value.redsocket.emit('gameresult', new GameResult(value.redscore, value.bluescore, value.prev_red_stats.points, newStat_red.points, false))

					server.to(value.room).emit('statusUpdate', new GameZIP(value))

					this.allgames.delete(key);
					server.to("all_spectators").emit('gamelist', new GameList(this.allgames))
					return;
				}
			}

			//*		vvv  POWER-UP Spawning  vvv
			if (value.modsenabled && !value.powerup.visible && Math.random() < 0.008 && !(value.ball.x > 900 && value.ball.x < 1100))
			{
				let poweruplocation = Math.random() * 80 + 10;
				value.powerup.y = poweruplocation;
				value.powerup.x = 100;
				value.powerup.visible = true;
				value.powerup.speed = 0;
				value.powerup.type = (Math.round(Math.random() * 10) % 3) + 1;
				if (Math.random() < 0.4)
				{
					value.powerup.speed = 1;
				}
				value.powerup.spawntime = 20;
			}
			//*		^^^  POWER-UP Spawning  ^^^
			
			if (value.status == gameStatus.game)	//?		Ongoing game
			{
				value.ball.x += value.ball.speed * Math.cos(value.ball.angle * Math.PI / 180) * value.ball.direction;	//?	Calculating new position for this frame
				value.ball.y += value.ball.speed * Math.sin(value.ball.angle * Math.PI / 180);
				value.gametime -= refreshRate;
				if (value.ball.y - ball_radius <= 5 || value.ball.y + ball_radius >= 95)
				{
					//?		Bounced with a wall
					value.ball.just_collided = true;
					value.ball.angle *= -1; 
					if (value.ball.y + value.ball.speed * Math.sin(value.ball.angle * Math.PI / 180) - ball_radius <= 5)
						value.ball.y = 5 + ball_radius;
					else if (value.ball.y + value.ball.speed * Math.sin(value.ball.angle * Math.PI / 180) + ball_radius >= 95)
						value.ball.y = 95 - ball_radius;
				}
				//*		vvv  Power-Up Applications  vvv
				if (value.ball.speed > ball_normal_speed)
				{
					value.ball.speed -= 0.01;
				}
				if (value.ball.invis_len > 0)
				{
					value.ball.opacity = Math.pow(Math.abs(1 - Math.sin(Math.pow(500 - value.ball.invis_len, 2) / 3000)), 1)
					value.ball.invis_len--;
				}
				else
					value.ball.opacity = 1;
				if (value.bluepaddle.radius < value.bluepaddle.usual_radius)
					value.bluepaddle.radius += Math.pow(value.bluepaddle.radius, 3) / 20000
				if (value.redpaddle.radius < value.redpaddle.usual_radius)
					value.redpaddle.radius += Math.pow(value.redpaddle.radius, 3) / 20000
				if (value.bluepaddle.radius > value.bluepaddle.usual_radius)
					value.bluepaddle.radius = value.bluepaddle.usual_radius;
				if (value.redpaddle.radius > value.redpaddle.usual_radius)
					value.redpaddle.radius = value.redpaddle.usual_radius;
				
				if (value.modsenabled && value.powerup.visible)
				{
					if (Math.sqrt(Math.pow(value.powerup.x - value.ball.x, 2) + Math.pow(value.powerup.y - value.ball.y, 2)) < ball_radius && value.powerup.spawntime <= 0)
					{
						if (value.powerup.type == 1)
						{
							value.ball.speed = ball_normal_speed * 3;
						}
						else if (value.powerup.type == 2)
						{
							value.ball.invis_len = 500;
							value.ball.opacity = 1;
						}
						else if (value.powerup.type == 3)
						{
							if (value.ball.direction == -1)
								value.bluepaddle.radius = 3;
							else if (value.ball.direction == 1)
								value.redpaddle.radius = 3;
						}
						value.powerup.visible = false;
					}
					else
						value.powerup.spawntime--;
					if (value.powerup.spawntime < 0)
						value.powerup.spawntime = 0;
					if (value.powerup.speed)
					{
						value.powerup.y += value.powerup.speed;
						if (value.powerup.y <= 5 || value.powerup.y >= 95)
							value.powerup.speed *= -1;
					}
				}
				if (value.ball.x - ball_radius <= paddle_distanceToMargin && !value.ball.passedLimit)		//? If ball touched the limit line on the left side
				{
					if (value.bluepaddle.y - value.bluepaddle.radius <= value.ball.y + value.ball.radius && value.bluepaddle.y + value.bluepaddle.radius >= value.ball.y - value.ball.radius)
					{
						// console.log("🔷 BOUNCE BLUE 🔷")
						value.ball.direction = 1;
						value.ball.passedLimit = false;
						value.ball.angle = 50 * ((value.ball.y - value.bluepaddle.y) / (value.bluepaddle.radius))
						if (value.ball.angle > 80)
							value.ball.angle = 80;
						else if (value.ball.angle < -80)
							value.ball.angle = -80;

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
					value.status = gameStatus.goalanimation_red;
					value.redscore += 1;
					value.waitEnd = current_time + 2000;
					value.ball.x = 100;
					value.ball.y = 50;
					if (value.blueserve)
						value.ball.direction = -1;
					else
						value.ball.direction = 1;
					value.ball.speed = ball_normal_speed;
					value.ball.invis_len = 0;
					value.ball.opacity = 1;
					value.powerup.visible = false;
					value.blueserve = !value.blueserve
					value.ball.angle = Math.round((Math.random() - 0.5) * 120);
					server.to("all_spectators").emit('gameupdate', new GameItem(value.id, value.blueid, value.redid, value.bluescore, value.redscore, value.gametime, value.room, value.modsenabled))
				}
				else if (value.ball.x + ball_radius >= 200)	//?	Blue scored on red's side
				{
					// console.log("💙💙💙 GOAAAALLLL 💙💙💙")
					value.status = gameStatus.goalanimation_blue;
					value.bluescore += 1;
					value.waitEnd = current_time + 2000;
					value.ball.x = 100;
					value.ball.y = 50;
					if (value.blueserve)
						value.ball.direction = -1;
					else
						value.ball.direction = 1;
					value.ball.speed = ball_normal_speed;
					value.ball.invis_len = 0;
					value.ball.opacity = 1;
					value.powerup.visible = false;
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
				value.waitEnd = current_time + 500;
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
