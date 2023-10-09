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
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateChatMessageDto } from 'src/chat/dto';
import {  WsGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/strategy';
import { ChatUserMessage } from '@prisma/client';
import { ChannelService } from 'src/channel/channel.service';
import { CreateChannelMessageDto, JoinChannelDto, ResponseChannelDto, ResponseChannelUserDto } from 'src/channel/dto';

   
// https://www.makeuseof.com/build-real-time-chat-api-using-websockets-nestjs/
@WebSocketGateway({
    cors: true,
    origin: process.env.WEB_URL
})

@UseGuards(WsGuard)
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect  {
    private socketsMap = new Map<string, string >();
    constructor(
        private readonly chatService: ChatService,
        private readonly authService: AuthService,
        private readonly channelService: ChannelService,
    ){}
    @WebSocketServer( )
    server: Server;

    async handleConnection(socket: Socket) {
        // const { token } = socket.handshake.auth;
        const user = await this.authService.isAuthorized(socket);
        this._usersConnected(user.sub, socket.id);
        socket.broadcast.emit('user_connects', user.sub);
        this.socketsMap.set(user.sub, socket.id);
        this._chatsAvailables(user.sub);
        this._channelsJoinedByUser(user.sub);
        this._loadUserChats(user.sub);
        this._loadUserChannels(user.sub, socket);  
    }

    async handleDisconnect(socket: Socket) {
        // const { token } = socket.handshake.auth;
        const user = await this.authService.isAuthorized(socket);
        this.socketsMap.delete(user.sub);
        this.server.sockets.emit('user_disconnects', user.sub);
    }

    @SubscribeMessage('send_message')
    async listenForMessages(@GetUser() user: JwtPayload, @MessageBody() message: CreateChatMessageDto) {
        const msg = await this.chatService.newChatMessage(
                        user.sub,
                        {
                            listenerId: message.listenerId,
                            chatId: message.chatId,
                            message: message.message,
                        }
                    );
        this._updateUsersChatId(message.chatId, msg.message);
    }

    @SubscribeMessage('send_new_message')
    async listenForNewMessages(@GetUser() user: JwtPayload, @MessageBody() message: CreateChatMessageDto) {
        const msg = await this.chatService.newChatMessage(
                        user.sub,
                        {
                            listenerId: message.listenerId,
                            message: message.message,
                            chatId: undefined,
                        }
                    );
        this._newChatAvailable(msg.chatId,  msg.message);
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
        console.log(`${message.channelId}_room`,' emmiting on ',`${message.channelId}_messages`,'this',   msg)
        this.server.to(`${message.channelId}_room`).emit(`${message.channelId}_messages`, [ msg ]);
    }

    @SubscribeMessage('typing')
    listenFortypingMessages(@MessageBody() message: string) {
        console.log('someone is typing');
    }

    private async _usersConnected(userId: string,usersSocket: string) {
        const usersId: string [] =  Array.from( this.socketsMap.keys() );
        this.server.to(usersSocket).emit('users_connected', usersId);
    }    

    private async _chatsAvailables(userId: string) {
        const chats: {
            chatId: string;
            userId: string;
            chatUserId: string;
            username: string;
        }[] = await this.chatService.getChatsByUserId(userId);
        const socket = this.socketsMap.get(userId);
        this.server.to(socket).emit('chats_availables', chats);
    }

    private async _channelsJoinedByUser(userId: string) {
        const channels: ResponseChannelDto[] = await this.channelService.getChannelsJoinedByUserId(userId);
        const socket = this.socketsMap.get(userId);
        this.server.to(socket).emit('joined_channels', channels);
    }

    @SubscribeMessage('join_channel')
    public async channelJoinedByUser(@GetUser() user: JwtPayload, @MessageBody() dto: JoinChannelDto, @ConnectedSocket() socket : Socket) {
        console.log(JoinChannelDto, dto);
        const channelUser1: ResponseChannelUserDto = await this.channelService.joinChannel(user.sub, dto);
        // const userId: string = user.sub;
        const channels: ResponseChannelDto[] = [await this.channelService.getChannelByChannelId(channelUser1.channelId)];
        // const socketId = this.socketsMap.get(userId);
        // Add channel into joined_channels ws for socket
        this.server.to(socket.id).emit('joined_channels', channels);
        // load users to its {channelId}_users ws for socket
        const channelUser: ResponseChannelUserDto[] = (await this._loadChannelUsers(socket.id, dto.channelId)).filter(x=>x.userId === user.sub);
        // load messages to its {channelId}_users ws for socket
        this._loadChannelMessages(socket.id, dto.channelId);
        // join the socket to the room
        socket.join(`${dto.channelId}_room`);
        // anounce to the room new joined user
        this.server.to(`${dto.channelId}_room`).emit(`${dto.channelId}_users`, channelUser );
    }

    private async _newChatAvailable(chatId: string, message: ChatUserMessage ){
        const chats: {
            chatId: string;
            userId: string;
            chatUserId: string;
            username: string;
        }[] = await this.chatService.getChatUsersByChatId(chatId);
        for (let chat of chats) {
            const socket  = this.socketsMap.get(chat.userId);
            if (socket !== undefined ) {
                this.server.to(socket).emit('new_chat_available', chats.filter(x=>x.userId !== chat.userId)[0]); // we are only sending one.
            }
        }
        this._updateUsersChatId(chatId, message);
    }
    
    private async _loadUserChats(userId: string) {
        const chats = await this.chatService.getChatsByUserId(userId);
        chats.forEach(chat =>{
            this._loadUserChatId(userId ,chat.chatId);
        });
    }
    
    private async _loadUserChatId(userId: string, chatId: string) {
        const chat = await this.chatService.getChatMessagesLighter(chatId);
        const socket: string = this.socketsMap.get(userId);
        this.server.to(socket).emit(chatId, chat);
    }

    private async _loadUserChannels(userId: string, socket: Socket) {
        const channels = await this.channelService.getChannelsJoinedByUserId(userId);
        channels.forEach(channel =>{
            this._loadChannelUsers(socket.id ,channel.channelId);
            this._loadChannelMessages(socket.id ,channel.channelId);
            socket.join(`${channel.channelId}_room`);
        });
    }

    private async _loadChannelUsers(socketId: string, channelId: string){
        const channelUsers = await this.channelService.getChannelUsers(channelId);
        this.server.to(socketId).emit(`${channelId}_users`, channelUsers);
        return channelUsers;
    }

    private async _loadChannelMessages(socketId: string, channelId: string){
        const channelMessages = await this.channelService.getChannelMessages(channelId);
        this.server.to(socketId).emit(`${channelId}_messages`, channelMessages);
    }

    private async _updateUsersChatId(chatId: string , message: ChatUserMessage ){
        const usersId: string[] = Array.from(((await this.chatService.getChatUsers(chatId)).map(x=>x.userId)));
        const messages: ChatUserMessage[] = [ message ];
        usersId.forEach(userId => {
            const socket: string = this.socketsMap.get(userId);
            this.server.to(socket).emit(chatId, messages);
        });
    }

}
