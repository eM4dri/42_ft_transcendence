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
import { Socket, Server } from 'socket.io';
import { EventsModule } from 'src/events/events.module';
import { UserService } from 'src/user/user.service';


@WebSocketGateway({
	cors: true,
	origin: process.env.WEB_URL
})
@UseGuards(WsGuard)
@Injectable()
export class GameGateway   implements OnGatewayInit, OnGatewayDisconnect {
	constructor(private readonly gameService: GameService, private readonly userService: UserService)
	{

	}
	

//	matchmaking_queue: string[] = [];
	matchmaking_queue = new Map<string, Socket>();

	allgames = new Map<number, Game>()

	allspectators = new Array<Socket>
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
		let idx = 0
		this.allspectators.forEach((value: Socket) => {
			if (socket == value)
			{
				console.log(">>>>> Spectator #", idx, "\x1b[0;31mDISCONNECTED\x1b[0m <<<<<", this.matchmaking_queue.size)
				delete(this.allspectators[idx]);
				return ;
			}
			idx++;
		});
	}
	
	@SubscribeMessage('matchmaking')
	async listenForMatchmaking(@GetUser() user: JwtPayload, @ConnectedSocket() socket : Socket) {
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
			this.gameService.createMatch(keyblue, keyred, roomname, valblue, valred);
			this.server.to("all_spectators").emit('gamelist', new GameList(this.allgames))
			let userid_list = []
			this.allgames.forEach((value: Game, key: number) =>
			{
				userid_list.push(value.blueid);
				userid_list.push(value.redid);
			})
			this._usersToCacheIndividual_byRoom("all_spectators", userid_list)
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

	@SubscribeMessage('getgamelist')
	listenForGetGameList(@ConnectedSocket() socket : Socket){
		console.log(">>> SENDING GAMELIST...")
		socket.emit('gamelist', new GameList(this.allgames))
		socket.join("all_spectators")
		let userid_list = []
		this.allgames.forEach((value: Game, key: number) =>
		{
			userid_list.push(value.blueid);
			userid_list.push(value.redid);
		})
		this._usersToCacheIndividual(socket, userid_list)
		
	}

	@SubscribeMessage('matchongoing')
	listenForMatchOngoing(@GetUser() user: JwtPayload, @ConnectedSocket() socket : Socket){
		
		this.allgames.forEach((value: Game, key: number) => {
			if (value.blueid == user.sub)
			{
				//?		Do we want to allow the same match in multiple windows?
//				value.bluesocket.leave(value.room);
				socket.join(value.room);
				value.bluesocket = socket;
			}
			else if (value.redid == user.sub)
			{
//				value.redsocket.leave(value.room);
				socket.join(value.room);
				value.redsocket = socket;
			}
		});
	}

	afterInit(){
		setInterval(() => {
			this.allgames = this.gameService.mainLoop(this.server);
		}, 20);
	}



    private async _usersToCacheIndividual(socket: Socket, usersId: string[]) {
		if (usersId.length > 1)
		{
			console.log(usersId)
			//const users = await this.userService.getUsers(usersId);
			const users = await this.userService.getUsers(usersId);
			socket.emit('individual_users_to_cache', users);
		}
    }

    private async _usersToCacheIndividual_byRoom(roomname: string, usersId: string[]) {
		if (usersId.length > 1)
		{
			console.log(usersId)
			//const users = await this.userService.getUsers(usersId);
			const users = await this.userService.getUsers(usersId);
			this.server.to(roomname).emit('individual_users_to_cache', users);
		}
    }

}

class GameList {
	finalist: Array<GameItem>
	constructor(themap: Map<number, Game>)
	{
		this.finalist = []
//		this.finalist.push(new GameItem(8766, "I'm BLUE", "I'm RED", 2, 4, 87, "roooommmm"))	//! DELETE
		themap.forEach((value: Game, key: number) =>
		{
			this.finalist.push(new GameItem(key, value.blueid, value.redid, value.bluescore, value.redscore, value.gametime, value.room))
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

	constructor(_gameid: number, _blueplayer: string, _redplayer: string, _bluescore: number, _redscore: number, _timeleft: number, _roomname: string)
	{
		this.gameid = _gameid;
		this.blueplayer = _blueplayer;
		this.redplayer = _redplayer;
		this.bluescore = _bluescore;
		this.redscore = _redscore;
		this.timeleft = _timeleft;
		this.roomname = _roomname;
	}
}