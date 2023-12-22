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
import { stats_user } from "@prisma/client";
import { StatsService } from '../stats/stats.service'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

var paddle_normal_speed: number = 1.25;	//! To change the default paddle speed

@WebSocketGateway({
	cors: true,
	origin: process.env.WEB_URL
})
@UseGuards(WsGuard)
@Injectable()
export class GameGateway   implements OnGatewayInit, OnGatewayDisconnect {
	constructor(
		private readonly gameService: GameService, 
		private readonly userService: UserService, 
		private statsService: StatsService, 
		private eventEmitter: EventEmitter2
		)
	{

	}
	

//	matchmaking_queue: string[] = [];
	matchmaking_queue = new Map<string, Socket>();
	modded_matchmaking_queue = new Map<string, Socket>();
	allcurrentspectators = new Map<Socket, string>();

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
				value.bluepaddle.direction = (message == 0 ? 0 : message / Math.abs(message)) * paddle_normal_speed;
			}
			else if (value.redid == user.sub)
			{
				value.redpaddle.direction = (message == 0 ? 0 : message / Math.abs(message)) * paddle_normal_speed;
			}
		})
	}

	@SubscribeMessage('disconnectedFromGame')
	async disconnectedFromGame(@ConnectedSocket() socket : Socket) {
		await this.handleDisconnect(socket);
	}

	async handleDisconnect(socket: Socket) {
		this.matchmaking_queue.forEach((value: Socket, key: string) => {
			if (socket == value)
			{
				this.matchmaking_queue.delete(key);
				return ;
			}
		});
		this.modded_matchmaking_queue.forEach((value: Socket, key: string) => {
			if (socket == value)
			{
				this.modded_matchmaking_queue.delete(key);
				return ;
			}
		});
		let idx = 0
		this.allspectators.forEach((value: Socket) => {
			if (socket == value)
			{
				delete(this.allspectators[idx]);
				return ;
			}
			idx++;
		});
		if (this.allcurrentspectators.has(socket))
		{
			this.allgames.forEach((value: Game, key: number) => {
				if (value.room == this.allcurrentspectators.get(socket))
				{
					value.spectators--;
				}
			});
			socket.leave(this.allcurrentspectators.get(socket));
		}
	}
	
	@SubscribeMessage('matchmaking')
	async listenForMatchmaking(@GetUser() user: JwtPayload, @ConnectedSocket() socket : Socket, @MessageBody() ismodded: boolean) {

		if (!ismodded)
		{
			if (!this.matchmaking_queue.has(user.sub))
			{
				this.eventEmitter.emit('addUserIdsWaiting', user.sub);
				this.matchmaking_queue.set(user.sub, socket);
			}
		}
		else
		{
			if (!this.modded_matchmaking_queue.has(user.sub))
			{
				this.eventEmitter.emit('addUserIdsWaiting', user.sub);
				this.modded_matchmaking_queue.set(user.sub, socket);
			}
		}
		if (!ismodded && this.matchmaking_queue.size >= 2)
		{
			let  keyblue: string = Array.from(this.matchmaking_queue)[0][0];
			let  keyred: string = Array.from(this.matchmaking_queue)[1][0];
			let  valblue: Socket = Array.from(this.matchmaking_queue)[0][1];
			let  valred: Socket = Array.from(this.matchmaking_queue)[1][1];
			let  randomid: string = (Math.round(Math.random() * 1000000)).toString()
			let roomname: string = `${keyblue}${keyred}${randomid}`
			valblue.join(roomname)
			valred.join(roomname)
			this.matchmaking_queue.delete(keyblue)
			this.matchmaking_queue.delete(keyred)
			const prev_blue: stats_user = await this.statsService.getUserStats(keyblue);
			const prev_red: stats_user = await this.statsService.getUserStats(keyred);

			this.gameService.createMatch(keyblue, keyred, roomname, valblue, valred, ismodded, prev_blue, prev_red, false);
			this.server.to("all_spectators").emit('gamelist', new GameList(this.allgames))
			let userid_list = []
			this.allgames.forEach((value: Game, key: number) =>
			{
				userid_list.push(value.blueid);
				userid_list.push(value.redid);
			})
			this._usersToCacheIndividual_byRoom("all_spectators", userid_list)
		}
		else if (ismodded && this.modded_matchmaking_queue.size >= 2)
		{
			let  keyblue: string = Array.from(this.modded_matchmaking_queue)[0][0];
			let  keyred: string = Array.from(this.modded_matchmaking_queue)[1][0];
			let  valblue: Socket = Array.from(this.modded_matchmaking_queue)[0][1];
			let  valred: Socket = Array.from(this.modded_matchmaking_queue)[1][1];
			let roomname: string = `${keyblue}${keyred}`
			valblue.join(roomname)
			valred.join(roomname)
			this.modded_matchmaking_queue.delete(keyblue)
			this.modded_matchmaking_queue.delete(keyred)
			const prev_blue: stats_user = await this.statsService.getUserStats(keyblue);
			const prev_red: stats_user = await this.statsService.getUserStats(keyred);

			this.gameService.createMatch(keyblue, keyred, roomname, valblue, valred, ismodded, prev_blue, prev_red, false);
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


	@SubscribeMessage('wannawatch')
	listenForWannaWatch(@ConnectedSocket() socket: Socket, @MessageBody() gameid: number) {
		if (this.allgames.has(gameid))
		{
			socket.join(this.allgames.get(gameid).room);
			this.allgames.get(gameid).spectators++;
			this.allcurrentspectators.set(socket, this.allgames.get(gameid).room);
		}
		else
		{
			socket.emit("gamenotfound");
		}
	}


	@SubscribeMessage('cancelmatchmaking')//
	listenForCancelMatchmaking(@GetUser() user: JwtPayload) {
		if (this.matchmaking_queue.has(user.sub))
		{
			this.matchmaking_queue.delete(user.sub);
		}
		else if (this.modded_matchmaking_queue.has(user.sub))
		{
			this.modded_matchmaking_queue.delete(user.sub);
		}
		this.eventEmitter.emit('deleteUserIdsWaiting', user.sub);
	}

	@SubscribeMessage('getgamelist')
	listenForGetGameList(@ConnectedSocket() socket : Socket){
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
				socket.join(value.room);
				value.bluesocket = socket;
			}
			else if (value.redid == user.sub)
			{
				socket.join(value.room);
				value.redsocket = socket;
			}
		});
	}

	@OnEvent('startChallenge')
	public async startChallenge(blueid: string, redid: string, bluesocket: Socket, redsocket: Socket, ismodded: boolean)
	{
		let  randomid: string = (Math.round(Math.random() * 1000000)).toString()
		let roomname: string = `${blueid}${redid}${randomid}`;
		bluesocket.join(roomname)
		redsocket.join(roomname)
		const prev_blue: stats_user = await this.statsService.getUserStats(blueid);
		const prev_red: stats_user = await this.statsService.getUserStats(redid);

		this.gameService.createMatch(blueid, redid, roomname, bluesocket, redsocket, ismodded, prev_blue, prev_red, true);
	}


	afterInit(){
		setInterval(() => {
			this.allgames = this.gameService.mainLoop(this.server);
		}, 20);
	}



    private async _usersToCacheIndividual(socket: Socket, usersId: string[]) {
		if (usersId.length > 1)
		{
			const users = await this.userService.getUsers(usersId);
			socket.emit('individual_users_to_cache', users);
		}
    }

    private async _usersToCacheIndividual_byRoom(roomname: string, usersId: string[]) {
		if (usersId.length > 1)
		{
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