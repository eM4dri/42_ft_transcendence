import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    } from '@nestjs/websockets';
    import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateChatMessageDto } from './dto';
import {  WsGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/strategy';
import { Chat, ChatUserMessage } from '@prisma/client';

    
// https://www.makeuseof.com/build-real-time-chat-api-using-websockets-nestjs/
@WebSocketGateway({
    cors: true,
    origin: process.env.WEB_URL
})

@UseGuards(WsGuard)
@Injectable()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect  {
    private initializationMap = new Map<string, string >();
    constructor(
        private readonly chatService: ChatService,
        private readonly authService: AuthService
    ){}
    @WebSocketServer( )
    server: Server;

    async handleConnection(socket: Socket) {
        // const { token } = socket.handshake.auth;
        const user = await this.authService.isAuthorized(socket);
        this._usersConnected(user.sub, socket.id);
        socket.broadcast.emit('user_connects', user.sub);
        this.initializationMap.set(user.sub, socket.id);
        this._chatsAvailables(user.sub);
        this._loadUserChats(user.sub);
    }

    async handleDisconnect(socket: Socket) {
        // const { token } = socket.handshake.auth;
        const user = await this.authService.isAuthorized(socket);
        this.initializationMap.delete(user.sub);
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

    @SubscribeMessage('typing')
    listenFortypingMessages(@MessageBody() message: string) {
        console.log('someone is typing');
    }

    private async _usersConnected(userId: string,usersSocket: string) {
        const usersId: string [] =  Array.from( this.initializationMap.keys() );
        this.server.to(usersSocket).emit('users_connected', usersId);
    }    

    private async _chatsAvailables(userId: string) {
        const chats: {
            chatId: string;
            userId: string;
            chatUserId: string;
            username: string;
        }[] = await this.chatService.getChatsByUserId(userId);
        const socket = this.initializationMap.get(userId);
        this.server.to(socket).emit('chats_availables', chats);
    }

    private async _newChatAvailable(chatId: string, message: ChatUserMessage ){
        const chats: {
            chatId: string;
            userId: string;
            chatUserId: string;
            username: string;
        }[] = await this.chatService.getChatUsersByChatId(chatId);
        for (let chat of chats) {
            const socket  = this.initializationMap.get(chat.userId);
            if (socket !== undefined ) {
                console.log('socket', socket);
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
        const socket: string = this.initializationMap.get(userId);
        this.server.to(socket).emit(chatId, chat);
    }

    private async _updateUsersChatId(chatId: string , message: ChatUserMessage ){
        const usersId: string[] = Array.from(((await this.chatService.getChatUsers(chatId)).map(x=>x.userId)));
        const messages: ChatUserMessage[] = [ message ];
        usersId.forEach(userId => {
            const socket: string = this.initializationMap.get(userId);
            this.server.to(socket).emit(chatId, messages);
        });
    }

}
