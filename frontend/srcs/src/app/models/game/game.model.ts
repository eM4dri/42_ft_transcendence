import { Paddle } from './paddle.model'
import { Ball } from './ball.model'
import { Powerup } from 'src/app/modules/game/game.classes';

export type Game = {
	id: number,
	bluename: string,
	redname: string,
	ball: Ball,
	powerup: Powerup,
	redpaddle: Paddle,
	redscore: number,
	bluepaddle: Paddle,
	bluescore: number,
	bluesocket: any,
	redsocket: any,
	gametime: number,	// Time in ms
	modsenabled: boolean;
	status: number,
	waitEnd: number,
	blueserve: boolean, //?		true: blue's serving  |  false: red's serving
	spectators: number
}
