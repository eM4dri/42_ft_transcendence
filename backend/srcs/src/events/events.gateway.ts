import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    } from '@nestjs/websockets';
    import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { BlockService } from '../block/block.service';
import { Injectable, UseGuards } from '@nestjs/common';
import {  WsGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/strategy';
import { ChatUserMessage } from '@prisma/client';
import { ChannelService } from '../channel/channel.service';
import { CreateChannelMessageDto, ResponseChannelDto, ResponseChannelUserDto } from '../channel/dto';
import { UserService } from '../user/user.service';
import { ChannelUser } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserFriendsService } from '../user/friends/user.friends.service';
import { ResponseUserMinDto } from '../user/dto';

// https://www.makeuseof.com/build-real-time-chat-api-using-websockets-nestjs/
@WebSocketGateway({
    cors: true,
    origin: process.env.WEB_URL
})

@UseGuards(WsGuard)
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect  {
    private socketsIdMap = new Map<string, string >();
    private socketsMap = new Map<string, Socket >();
    constructor(
        private readonly chatService: ChatService,
        private readonly authService: AuthService,
        private readonly channelService: ChannelService,
        private readonly blockService: BlockService,
        private readonly userfriendsService: UserFriendsService,
        private readonly userService: UserService,
        private readonly eventEmitter: EventEmitter2
    ){}
    @WebSocketServer( )
    server: Server;

    async handleConnection(socket: Socket) {
        try {
            const { token } = socket.handshake.auth;
            if (token){
                const user = await this.authService.isAuthorized(socket);
                socket.broadcast.emit('user_connects', user.sub);
                this.socketsIdMap.set(user.sub, socket.id);
                this.socketsMap.set(user.sub, socket);
            }
            else {
                socket.disconnect();
            }
        } catch (error) {
            // TODO handle WS errors conections
            console.log('TODO handle WS errors conections')
        }
    }

    async handleDisconnect(socket: Socket) {
        try {
            const { token } = socket.handshake.auth;
            if (token){
                const user = await this.authService.isAuthorized(socket);
                this.socketsIdMap.delete(user.sub);
                this.socketsMap.delete(user.sub);
                this.server.sockets.emit('user_disconnects', user.sub);
                this.eventEmitter.emit('disconnectChallenges',user.sub);
            }
        } catch (error) {
            // TODO handle WS errors conections
            console.log('TODO handle WS errors conections')
        }
    }

    @SubscribeMessage('client_ready')
    async clientReadyForData(@GetUser() user: JwtPayload ,@ConnectedSocket() socket : Socket) {
        this._usersConnected(user.sub, socket.id);
        const channelsIds = await this._channelsJoinedByUser(user.sub);
        const blockedUserIds = await this._blockedUserIds(user.sub, socket.id);
        const friendUserIds = await this._friendUserIds(user.sub, socket.id);
        const chatUserIds = await this._chatsAvailables(user.sub);
        const channelUserId = await this.channelService.getUsersIds(channelsIds);
        const usersIds:string [] = chatUserIds.concat(blockedUserIds,friendUserIds, channelUserId);
        this._usersToCache(socket.id, usersIds.filter(x=>x));
        this._loadUserChats(user.sub);
    }

    @SubscribeMessage('susbcribe_channel')
    subscribeChannel(@GetUser() user: JwtPayload , @ConnectedSocket() socket : Socket, @MessageBody() channelId: string) {
        this._loadUserChannel(channelId, user.sub, socket);
    }

    @OnEvent('susbcribe_created_channel')
    subscribeCreatedChannel(channel: ResponseChannelDto, channelUser: ResponseChannelUserDto) {
        const socket = this.socketsMap.get(channelUser.userId);
        if (socket !== undefined) {
            this.server.to(socket.id).emit('joined_channels', [channel]);
            this._loadUserChannel(channelUser.channelId, channelUser.userId, socket);
        }
    }

    @SubscribeMessage('send_channel_message')
    async listenForChannelMessages(@GetUser() user: JwtPayload, @MessageBody() message: CreateChannelMessageDto) {
        const msg = await this.channelService.newChannelMessage(
                        user.sub,
                        {
                            channelId: message.channelId,
                            message: message.message,
                        }
                    );
        this.server.to(`${message.channelId}_room`).emit(`${message.channelId}_messages`, [ msg ]);
    }

    @SubscribeMessage('typing')
    listenFortypingMessages(@MessageBody() message: string) {
        console.log('someone is typing');
    }

    private async _usersConnected(userId: string,usersSocket: string) {
        const usersId: string [] =  Array.from( this.socketsIdMap.keys() );
        this.server.to(usersSocket).emit('users_connected', usersId);
    }

    private async _blockedUserIds(userId: string, usersSocket: string) {
        const blockedUserIds: string [] = await this.blockService.getBlockedList(userId);
        this.server.to(usersSocket).emit('blocked_userids', blockedUserIds);
        return blockedUserIds;
    }

    private async _friendUserIds(userId: string, usersSocket: string) {
        const friendUserIds = await this.userfriendsService.getFriendList(userId);
        this.server.to(usersSocket).emit('friend_userids', friendUserIds);
        return friendUserIds;
    }

    private async _chatsAvailables(userId: string) {
        const chats = await this.chatService.getChatsByUserId(userId);
        const socket = this.socketsIdMap.get(userId);
        this.server.to(socket).emit('chats_availables', chats);
        const usersIds: string [] = Array.from(chats.map(x=>x.userId));
        return usersIds;
    }

    private async _channelsJoinedByUser(userId: string) {
        const channels: ResponseChannelDto[] = await this.channelService.getChannelsJoinedByUserId(userId);
        const socket = this.socketsIdMap.get(userId);
        this.server.to(socket).emit('joined_channels', channels);
        return channels.map(x=>x.channelId);
    }

    @OnEvent('user_join_channel')
    public async channelJoinedByUser2(channelUser: ResponseChannelUserDto) {
        const channels: ResponseChannelDto[] = [await this.channelService.getChannelByChannelId(channelUser.channelId)];
        const socket: Socket = this.socketsMap.get(channelUser.userId);
        const channelId: string = channelUser.channelId;
        const channels_userIds = await this.channelService.getUsersIds([channelUser.channelId]);
        for (const userId of channels_userIds){
            const socketId = this.socketsIdMap.get(userId);
            this._usersToCache(socketId, [channelUser.userId]);            
        }
        if (socket !== undefined) {
            // Add channel into joined_channels ws for socket
            this.server.to(socket.id).emit('joined_channels', channels);
            // load user data to show
            this._usersToCache(socket.id, channels_userIds);
            // load users to its {channelId}_users ws for socket
            this._loadChannelUsers(socket.id, channelId);
            // load messages to its {channelId}_users ws for socket
            this._loadChannelMessages(socket.id, channelId);
            // join the socket to the room
            socket.join(`${channelId}_room`);
        }
        // anounce to the room new joined user
        this.server.to(`${channelId}_room`).emit(`${channelId}_users`, [channelUser] );
    }

    @OnEvent('newChat')
    private async _newChatAvailable(chatId: string, message: ChatUserMessage ){
        const chats = await this.chatService.getChatUsersByChatId(chatId);
        const usersIds = Array.from(chats).map(x=>x.userId);
        for (let chat of chats) {
            const socket  = this.socketsIdMap.get(chat.userId);
            if (socket !== undefined ) {
                this._usersToCache(socket, usersIds.filter(x=>x !== chat.userId)).then( () => {
                    this.server.to(socket).emit('new_chat_available', chats.filter(x=>x.userId !== chat.userId)[0]); // we are only sending one.
                }).finally( () => {
                    this._updateUsersChatId(chatId, message)
                });
            }
        }
    }

    private async _loadUserChats(userId: string) {
        const chats = await this.chatService.getChatsByUserId(userId);
        chats.forEach(chat =>{
            this._loadUserChatId(userId ,chat.chatId);
        });
    }

    private async _loadUserChatId(userId: string, chatId: string) {
        const chat = await this.chatService.getChatMessagesLighter(chatId);
        const socket: string = this.socketsIdMap.get(userId);
        this.server.to(socket).emit(chatId, chat);
    }

    private async _loadUserChannel(channelId: string, userId:string, socket: Socket) {
        this._channelUsersToCache(socket.id, [channelId]);
        this._loadMyChannelUser(socket.id, channelId, userId);
        this._loadChannelUsers(socket.id, channelId);
        this._loadChannelMessages(socket.id, channelId);
        socket.join(`${channelId}_room`);
    }

    @OnEvent('update_channel_user')
    async updateChannelUser(channelUser: ChannelUser){
        const socket: string = this.socketsIdMap.get(channelUser.userId);
        this.server.to(socket).emit(`${channelUser.channelId}_myuser`, channelUser);
    }

    @OnEvent('channel_user_leaves')
    async channelUserLeaves(channelUser: ChannelUser){
        const socketId: string = this.socketsIdMap.get(channelUser.userId);
        const socket: Socket = this.socketsMap.get(channelUser.userId);
        if (socket) {
            socket.leave(`${channelUser.channelId}_room`);
            this.server.to(socketId).emit('channel_user_leaves', channelUser.channelId);
        }
    }

    private async _loadMyChannelUser(socketId: string, channelId: string, userId: string,){
        const myChannelUser = await this.channelService.getMyChannelUser(channelId, userId);
        this.server.to(socketId).emit(`${channelId}_myuser`, myChannelUser);
    }

    private async _loadChannelUsers(socketId: string, channelId: string){
        const channelUsers = await this.channelService.getChannelUsers(channelId);
        this.server.to(socketId).emit(`${channelId}_users`, channelUsers);
    }

    private async _loadChannelMessages(socketId: string, channelId: string){
        const channelMessages = await this.channelService.getChannelMessages(channelId);
        this.server.to(socketId).emit(`${channelId}_messages`, channelMessages);
    }

    @OnEvent('updateChat')
    private async _updateUsersChatId(chatId: string , message: ChatUserMessage ){
        const usersId: string[] = Array.from(((await this.chatService.getChatUsers(chatId)).map(x=>x.userId)));
        const messages: ChatUserMessage[] = [ message ];
        usersId.forEach(userId => {
            const socket: string = this.socketsIdMap.get(userId);
            this.server.to(socket).emit(chatId, messages);
        });
    }

    private async _channelUsersToCache(socketId: string, channelsId: string[]) {
        const userIds = await this.channelService.getUsersIds(channelsId);
        this._usersToCache(socketId, userIds);
    }

    private async _usersToCache(socketId: string, usersId: string[]) {
        const users: ResponseUserMinDto[] = await this.userService.getUsersMin(usersId);
        this.server.to(socketId).emit('users_to_cache', users);
    }

    @OnEvent('hereComesANewChallenger')
    async hereComesANewChallenger(challengerUserId:string, challengedUserId: string) {
        const socketId: string = this.socketsIdMap.get(challengedUserId);
        this._usersToCache(socketId, [challengerUserId]).then(() => {
            this.server.to(socketId).emit(`here_comes_a_new_challenger_for_${challengedUserId}`, challengerUserId);
        });
    }

    @OnEvent('acceptChallenge')
    acceptChallenge(userId1: string, userId2: string){
        const socket1 = this.socketsMap.get(userId1);
        const socket2 = this.socketsMap.get(userId2);
        if(socket1!==undefined) {
            socket1.emit("start_challenge", true);
        }
        if(socket2!==undefined) {
            socket2.emit("start_challenge", true);
        }
        this.eventEmitter.emit('startChallenge', userId1, userId2, socket1, socket2, true);
    }

    @OnEvent('clearChallenges')
    clearChallenges(userIds: string[]){
        for (const userId of userIds) {
            const socketId: string = this.socketsIdMap.get(userId);
            this.server.to(socketId).emit('clear_challenges', userId)
        }
    }

    @OnEvent('userBanned')
    private _userBanned(userId: string){
        const socketId: string = this.socketsIdMap.get(userId);
        this.server.to(socketId).emit('user_banned', userId)
    }

    @OnEvent('userPromoted')
    private _userPromoted(userId: string){
        const socketId: string = this.socketsIdMap.get(userId);
        this.server.to(socketId).emit('user_promoted', userId)
    }

    @OnEvent('userDemoted')
    private _userDemoted(userId: string){
        const socketId: string = this.socketsIdMap.get(userId);
        this.server.to(socketId).emit('user_demoted', userId)
    }

    @OnEvent('userStartPlaying')
    private _userStartPlaying(userId: string, gameId: number){
        const gameUser = { userId: userId, gameId: gameId };
        this.server.sockets.emit('user_start_playing', gameUser);
    }

    @OnEvent('usersStopPlaying')
    private _usersStopPlaying(userIds: string[]){
        this.server.sockets.emit('users_stop_playing', userIds);
    }
}
