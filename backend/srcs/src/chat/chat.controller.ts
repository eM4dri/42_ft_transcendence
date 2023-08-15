import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
    constructor(private chatService: ChatService) {  }

    @Get(':userId')
    getChats(@Param('userId', ParseIntPipe) userId: number){ // en realidad vamos a estar autenticados con el usuario no debe entrar por querystring
        return this.chatService.getChats(userId);
    }

}
