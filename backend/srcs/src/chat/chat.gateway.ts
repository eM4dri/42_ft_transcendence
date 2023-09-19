import {
    MessageBody,
    OnGatewayConnection,
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
export class ChatsGateway implements OnGatewayConnection  {
// export class ChatsGateway {
    private initializationMap = new Map<string, string >();
    constructor(
        private readonly chatService: ChatService,
        private readonly authService: AuthService
    ){}
    @WebSocketServer( )
    server: Server;

    async handleConnection(socket: Socket) {
        const { token } = socket.handshake.auth;
        // console.log(token);
        const user = await this.authService.isAuthorized(socket);
        this.initializationMap.set(user.sub, socket.id);
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

    @SubscribeMessage('typing')
    listenFortypingMessages(@MessageBody() message: string) {
        console.log('someone is typing');
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('get_chats')
    async getChats(@GetUser() user: JwtPayload) {
        const chats = await this.chatService.getChats(user.sub);
        const socket = this.initializationMap.get(user.sub);
        this.server.sockets.to(socket).emit('chats_availables', chats);
    }
    
    @SubscribeMessage('load_chat')
    async loadChat(@MessageBody() chatId: string) {
        const chat = await this.chatService.getChatMessagesLighter(chatId);
        const chatUsers = await this.chatService.getChatUsers(chatId);
        for(let chatUser of chatUsers){
            const socket = this.initializationMap.get(chatUser.userId);
            if (socket !== undefined)
                this.server.sockets.to(socket).emit('chat_loaded', chat);
        }
    }

}