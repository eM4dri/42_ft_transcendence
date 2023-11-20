import { Paddle } from './paddle.model'
import { Ball } from './ball.model'

export type Game = {
	id: number,
	ball: Ball,
	redpaddle: Paddle,
	redscore: number,
	bluepaddle: Paddle,
	bluescore: number,
	gametime: number,	// Time in ms
	status: number,
	waitEnd: number,
	blueserve: boolean //?		true: blue's serving  |  false: red's serving
}
