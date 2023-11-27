
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
	ball: Ball;
	redpaddle: Paddle;
	redscore: number = 0;
	bluepaddle: Paddle;
	bluescore: number = 0;
	gametime: number = 120000;	// Time in ms
	modsenabled: boolean = false;
	constructor()
	{
		this.id = 0;
		this.redpaddle = new Paddle;
		this.bluepaddle = new Paddle;
		this.ball = new Ball;
	}
	status: number = gameStatus.pregame;
	waitEnd: number = 0;
	blueserve: boolean = false; //?		true: blue's serving  |  false: red's serving
}