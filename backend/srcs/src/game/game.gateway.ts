import {
	ConnectedSocket,
	MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	} from '@nestjs/websockets';
import { Injectable, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/guard';
import { GameService } from 'src/game/game.service';
import { JwtPayload } from 'src/auth/strategy';
import { GetUser } from 'src/auth/decorator';
import { Game } from './game.service'
import { Paddle } from './game.service'
import { Ball } from './game.service'
//import { Server } from 'http';
import { Socket, Server } from 'socket.io';


@WebSocketGateway({
	cors: true,
	origin: process.env.WEB_URL
})
@UseGuards(WsGuard)
@Injectable()
export class GameGateway   implements OnGatewayInit, OnGatewayDisconnect {
	constructor(private readonly gameService: GameService)
	{

	}
	
//	matchmaking_queue: string[] = [];
	matchmaking_queue = new Map<string, Socket>();

	allgames = new Map<number, Game>()
	@WebSocketServer( )
	server: Server;
	@SubscribeMessage('keypressed')
	listenForKeyPressed(@GetUser() user: JwtPayload, @ConnectedSocket() socket : Socket, @MessageBody() message: number) {
		this.allgames.forEach((value: Game, key: number) =>
		{
			if (value.blueid == user.sub)
			{
				value.bluepaddle.direction = message == 0 ? 0 : message / Math.abs(message);
			}
			else if (value.redid == user.sub)
			{
				value.redpaddle.direction = message == 0 ? 0 : message / Math.abs(message);
			}
		})
//		const newpaddle: Paddle = this.allgames.get(100000).bluepaddle;
//		console.log(user.sub, 'is pressing a key. (', message, ")");
//		this.allgames.get(100000).bluepaddle.direction = message;	//TODO  This is temporary. Need to find the game and player that's being affected!!
//		this.server.emit("HelloSignal", newpaddle)
	}

	async handleDisconnect(socket: Socket) {
		this.matchmaking_queue.forEach((value: Socket, key: string) => {
			if (socket == value)
			{
				console.log(">>>>>", key, "\x1b[0;31mDISCONNECTED\x1b[0m <<<<<", this.matchmaking_queue.size)
				this.matchmaking_queue.delete(key);
				return ;
			}
		});
	}
	
	@SubscribeMessage('matchmaking')
	listenForMatchmaking(@GetUser() user: JwtPayload, @ConnectedSocket() socket : Socket) {
		if (!this.matchmaking_queue.has(user.sub))
		{
			this.matchmaking_queue.set(user.sub, socket);
			console.log(">>>>>>>>", user.sub, "\x1b[0;32mJOINED\x1b[0m <<<<<<<<", this.matchmaking_queue.size)
		}
		else
			console.log(">>>", user.sub, "\x1b[0;33mWAS ALREADY HERE\x1b[0m <<<", this.matchmaking_queue.size)
		if (this.matchmaking_queue.size >= 2)
		{
			let  keyblue: string = Array.from(this.matchmaking_queue)[0][0];
			let  keyred: string = Array.from(this.matchmaking_queue)[1][0];
			let  valblue: Socket = Array.from(this.matchmaking_queue)[0][1];
			let  valred: Socket = Array.from(this.matchmaking_queue)[1][1];
			let roomname: string = `${keyblue}${keyred}`
			valblue.join(roomname)
			valred.join(roomname)
			this.matchmaking_queue.delete(keyblue)
			this.matchmaking_queue.delete(keyred)
			this.gameService.createMatch(keyblue, keyred, roomname);
		}
	}

	@SubscribeMessage('cancelmatchmaking')
	listenForCancelMatchmaking(@GetUser() user: JwtPayload) {
		if (this.matchmaking_queue.has(user.sub))
		{
			this.matchmaking_queue.delete(user.sub);
			console.log(">>>>>>>>", user.sub, "\x1b[0;31mCANCELED\x1b[0m <<<<<<<<", this.matchmaking_queue.size)
		}
		else
			console.log(">>>>>>", user.sub, "\x1b[0;33mNOT CANCELED\x1b[0m <<<<<<", this.matchmaking_queue.size)
	}


	afterInit(){
		setInterval(() => {
			this.allgames = this.gameService.mainLoop(this.server);
		}, 20);
	}

}
