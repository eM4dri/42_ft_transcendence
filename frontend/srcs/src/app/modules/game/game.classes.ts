
export enum gameStatus
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
	speed: number = 1;		
	angle: number = 60;		// -90 ↑  |  0 ⭤  |  90 ↓ (0's direction gets decided by the parameter below. Don't let the angle be >= 90 || <= -90)
	direction: number = -1;	//  -1 ←  |  1 →
	radius: number = 5;		// 5% of the field.
	passedLimit: boolean = false;
	opacity: number = 1;
	invis_len: number = 0
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
	type: number = 1;		//	1: Speed
	visible: boolean = false;
}

export class Game
{
	id: number;
	ball: Ball;
	bluename: string = "Blue Player";
	redname: string = "Red Player";
	redpaddle: Paddle;
	redscore: number = 0;
	bluepaddle: Paddle;
	bluescore: number = 0;
	powerup: Powerup;
	gametime: number = 120000;	// Time in ms
	modsenabled: boolean = false;
	spectators: number = 0;
	constructor()
	{
		this.id = 0;
		this.redpaddle = new Paddle;
		this.bluepaddle = new Paddle;
		this.ball = new Ball;
		this.powerup = new Powerup;
	}
	status: number = gameStatus.pregame;
	waitEnd: number = 0;
	blueserve: boolean = false; //?		true: blue's serving  |  false: red's serving
}

class GameResult {
	yourscore: number = 0;
	theirscore: number = 0;
	prev_points: number = 0;
	earned_points: number = 0;
	are_you_blue: boolean = true;
}