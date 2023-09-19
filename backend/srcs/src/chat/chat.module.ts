import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatsGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatsGateway,
    JwtService,
    AuthService
  ],
})
export class ChatModule {}
