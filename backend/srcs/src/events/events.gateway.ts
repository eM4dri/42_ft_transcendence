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
import { ChatService } from 'src/chat/chat.service';
import { BlockService } from 'src/block/block.service';
import { Injectable, UseGuards } from '@nestjs/common';
import {  WsGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/strategy';
import { ChatUserMessage } from '@prisma/client';
import { ChannelService } from 'src/channel/channel.service';
import { CreateChannelMessageDto, JoinChannelDto, ResponseChannelDto, ResponseChannelUserDto } from 'src/channel/dto';
import { UserService } from 'src/user/user.service';
import { ChannelUser } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';


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
        private readonly userService: UserService
    ){}
    @WebSocketServer( )
    server: Server;

    async handleConnection(socket: Socket) {
        try {
            const user = await this.authService.isAuthorized(socket);
            socket.broadcast.emit('user_connects', user.sub);
            this.socketsIdMap.set(user.sub, socket.id);
            this.socketsMap.set(user.sub, socket);
        } catch (error) {
            // TODO handle WS errors conections
            console.log('TODO handle WS errors conections')
        }

        // const { token } = socket.handshake.auth;
    }

    async handleDisconnect(socket: Socket) {
        // const { token } = socket.handshake.auth;
        try {
            const user = await this.authService.isAuthorized(socket);
            this.socketsIdMap.delete(user.sub);
            this.socketsMap.delete(user.sub);
            this.server.sockets.emit('user_disconnects', user.sub);
        } catch (error) {
            // TODO handle WS errors conections
            console.log('TODO handle WS errors conections')
        }
    }

    @SubscribeMessage('client_ready')
    clientReadyForData(@GetUser() user: JwtPayload ,@ConnectedSocket() socket : Socket) {
        this._usersConnected(user.sub, socket.id);
        this._usersBlocked(user.sub);
        this._chatsAvailables(user.sub);
        this._channelsJoinedByUser(user.sub);
        this._loadUserChats(user.sub);
    }

    @SubscribeMessage('susbcribe_channel')
    subscribeChannel(@GetUser() user: JwtPayload , @ConnectedSocket() socket : Socket, @MessageBody() channelId: string) {
        this._loadUserChannel(channelId, user.sub, socket);
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

    private async _usersBlocked(userId: string) {
        const users_blocked = await this.blockService.getBlockedList(userId);
        const socket = this.socketsIdMap.get(userId);
        this.server.to(socket).emit('users_blocked', users_blocked);
    }

    private async _chatsAvailables(userId: string) {
        const chats = await this.chatService.getChatsByUserId(userId);
        const socket = this.socketsIdMap.get(userId);
        this.server.to(socket).emit('chats_availables', chats);
        const usersIds = Array.from(chats.map(x=>x.userId));
        this._usersToCache(socket, usersIds);
    }

    private async _channelsJoinedByUser(userId: string) {
        const channels: ResponseChannelDto[] = await this.channelService.getChannelsJoinedByUserId(userId);
        const socket = this.socketsIdMap.get(userId);
        this.server.to(socket).emit('joined_channels', channels);
    }

    @SubscribeMessage('join_channel')
    public async channelJoinedByUser(@GetUser() user: JwtPayload, @MessageBody() dto: JoinChannelDto, @ConnectedSocket() socket : Socket) {
        const channelUser: ResponseChannelUserDto = await this.channelService.joinChannel(user.sub, dto);
        // const userId: string = user.sub;
        const channels: ResponseChannelDto[] = [await this.channelService.getChannelByChannelId(channelUser.channelId)];
        // const socketId = this.socketsMap.get(userId);
        // Add channel into joined_channels ws for socket
        this.server.to(socket.id).emit('joined_channels', channels);
        // load user data to show
        this._channelUsersToCache(socket.id, [dto.channelId]);
        // load users to its {channelId}_users ws for socket
       this._loadChannelUsers(socket.id, dto.channelId);
        // load messages to its {channelId}_users ws for socket
        this._loadChannelMessages(socket.id, dto.channelId);
        // join the socket to the room
        socket.join(`${dto.channelId}_room`);
        // anounce to the room new joined user
        this.server.to(`${dto.channelId}_room`).emit(`${dto.channelId}_users`, channelUser );
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
        socket.leave(`${channelUser.channelId}_room`);
        this.server.to(socketId).emit('channel_user_leaves', channelUser.channelId);
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
        const channelsUsers = Array.from(await this.channelService.getChannelsUsersIds(channelsId)).map(x=>x.userId);
        this._usersToCache(socketId, channelsUsers);
    }

    private async _usersToCache(socketId: string, usersId: string[]) {
        const users = await this.userService.getUsers(usersId);
        this.server.to(socketId).emit('users_to_cache', users);
    }
}
