import { Injectable } from '@nestjs/common';
import { Server } from 'http'
import { Historic_GameDto } from '../historic_games/dto';
import { HistoricGamesController } from '../historic_games/historic_games.controller'
import { historical_games } from '@prisma/client';


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
	direction: number = 1;	//  -1 ←  |  1 →
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
	ball: Ball;
	redpaddle: Paddle;
	redscore: number = 0;
	bluepaddle: Paddle;
	bluescore: number = 0;
	gametime: number = 12000;	// Time in ms
	constructor(newid: number)
	{
		this.id = newid;
		this.redpaddle = new Paddle;
		this.bluepaddle = new Paddle;
		this.ball = new Ball;
	}
	status: number = gameStatus.pregame;
	waitEnd: number = 0;
	blueserve: boolean = false; //?		true: blue's serving  |  false: red's serving
}

var allgames = new Map<number, Game>();

//!		Start new match event
{
	let newuid = Math.round(/*Math.random()*/1 * 100000);
	allgames.set(newuid, new Game(newuid))
}

@Injectable()
export class GameService {
	
	public  mainLoop(server: Server): Map<number, Game>
	{
		let current_time: number = Date.now();
		allgames.forEach((value: Game, key: number) =>
		{
			if (value.waitEnd >= current_time)		//?		Waiting for something. Wait hasn't ended yet.
			{
				if (value.status != 0 && value.status != 1 && value.status != 4)
				{
					if (value.bluepaddle.y + value.bluepaddle.direction >= paddle_radius && value.bluepaddle.y + value.bluepaddle.direction <= 100 - paddle_radius)
						value.bluepaddle.y += value.bluepaddle.direction;
					if (value.redpaddle.y + value.redpaddle.direction >= paddle_radius && value.redpaddle.y + value.redpaddle.direction <= 100 - paddle_radius)
						value.redpaddle.y += value.redpaddle.direction;
					server.emit('statusUpdate', value)
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
					let historicClass: HistoricGamesController;

					const newHistoricGame: Historic_GameDto = {
						localId: "7ccbceb0-5ab7-48bf-b766-01437e4a9aac",
						visitorId: "c7392593-c0b5-4e6c-9edd-44887282d8b5",
						localGoals: value.bluescore,
						visitorGoals: value.redscore,
						winLocal: value.bluescore > value.redscore,
						winVisitor: value.bluescore < value.redscore,
						draw: value.bluescore == value.redscore,
						pointsLocal: 50 * value.bluescore > value.redscore ? 1 : 0 + 20 * value.bluescore == value.redscore ? 1 : 0 + value.bluescore,
						pointsVisitor: 50 * value.redscore > value.bluescore ? 1 : 0 + 20 * value.redscore == value.bluescore ? 1 : 0 + value.bluescore
					}

				//! vvv  Not working for now  vvv
//					historicClass.post_historic_game(newHistoricGame)
				//! ^^^                       ^^^
					//?		see POST /historic-games in localhost:3000
					//?		backend/srcs/src/historic_games/historic_games.controller.ts -> L74
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
					}
					else		//?		The ball didn't touch the paddle so scoring is now unavoidable.
					{
						value.ball.passedLimit = true;
					}
				}
				else if (value.ball.x - ball_radius <= 0)	//?	Red scored on blue's side
				{
					//!		Send GOAL signal
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
			server.emit('statusUpdate', value)	//?		Sending the status of the game to the clients to update their info.
		});
		return (allgames)
	}
}
