export type Ball = {
	x: number,		//	← 0  |  200 →
	y: number,			//	↑ 0  |  100 ↓
	speed: number,		
	angle: number;		// -90 ↑  |  0 ⭤  |  90 ↓ (0's direction gets decided by the parameter below. Don't let the angle be >= 90 || <= -90)
	direction: number,	//  -1 ←  |  1 →
	radius: number,		// 5% of the field.
	passedLimit: boolean
}