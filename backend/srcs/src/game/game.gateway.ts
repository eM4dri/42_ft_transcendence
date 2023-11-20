import {
	MessageBody,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { Server } from 'http';
import { Game } from './game.service'
import { Paddle } from './game.service'
import { Ball } from './game.service'

@WebSocketGateway({
	cors: true,
	origin: process.env.WEB_URL
})
@Injectable()
export class GameGateway   implements OnGatewayInit {
	constructor(private readonly gameService: GameService)
	{

	}

	allgames = new Map<number, Game>()
	@WebSocketServer( )
	server: Server;
	@SubscribeMessage('keypressed')
	listenForKeyPressed(@MessageBody() message: number) {
		const newpaddle: Paddle = this.allgames.get(100000).bluepaddle;
		console.log('someone is pressing a key. (', message, ")");
		this.allgames.get(100000).bluepaddle.direction = message;	//TODO  This is temporary. Need to find the game and player that's being affected!!
//		this.server.emit("HelloSignal", newpaddle)
	}
	afterInit(){
		setInterval(() => {
			this.allgames = this.gameService.mainLoop(this.server);
//			console.log("~~~~~~~~~~", this.allgames, "-----------", this.allgames[100000].bluepaddle)
		}, 20);
	}

}
