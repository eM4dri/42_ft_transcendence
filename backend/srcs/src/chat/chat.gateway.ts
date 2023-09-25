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
        this.initializationMap.set(user.sub, socket.id);
        this._loadConnectedUsers(user.sub, socket.id);
        this._userConnects(user.sub, socket.id);
        this._loadChats(user.sub);
    }

    async handleDisconnect(socket: Socket) {
        // const { token } = socket.handshake.auth;
        const user = await this.authService.isAuthorized(socket);
        this.initializationMap.delete(user.sub);
        this._userDisconnects(user.sub);
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
        this.loadChat(message.chatId);
    }

    @SubscribeMessage('send_new_message')
    async listenForNNewMessages(@GetUser() user: JwtPayload, @MessageBody() message: CreateChatMessageDto) {
        const msg = await this.chatService.newChatMessage(
                        user.sub,
                        {
                            listenerId: message.listenerId,
                            message: message.message,
                            chatId: undefined,
                        }
                    );
        this._loadChats(user.sub);
        this._loadChats(message.listenerId);
        this.loadChat(msg.chatId);
    }

    @SubscribeMessage('typing')
    listenFortypingMessages(@MessageBody() message: string) {
        console.log('someone is typing');
    }

    private async _loadConnectedUsers(userId: string,usersSocket: string) {
        const usersId: string [] =  Array.from( this.initializationMap.keys() );
        this.server.sockets.to(usersSocket).emit('users_connected', usersId.filter(id => id  != userId ));
    }    
    private async _userConnects(userId: string, usersSocket: string) {
        const sockets: string [] =  Array.from( this.initializationMap.values() );
        for (let socket of sockets.filter(ws => ws !== usersSocket)){
            this.server.sockets.to(socket).emit('user_connects', userId);
        }
    }    

    private async _userDisconnects(userId: string){
        this.server.sockets.emit('user_disconnects', userId);
    }

    private async _loadChats(userId: string){
        const chats = await this.chatService.getChats(userId);
        const socket = this.initializationMap.get(userId);
        this.server.sockets.to(socket).emit('chats_availables', chats);
    }
    
    @SubscribeMessage('load_chat')
    async loadChat(@MessageBody() chatId: string) {
        const chat = await this.chatService.getChatMessagesLighter(chatId);
        const sockets: string [] =  Array.from( this.initializationMap.values() );
        for (let socket of sockets){
            this.server.sockets.to(socket).emit(chatId, chat);
        }
    }

}
