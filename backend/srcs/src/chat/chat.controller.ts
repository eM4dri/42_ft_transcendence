import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateChatDto } from './dto';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':userId')
  @ApiOperation({
    description: 'Get all users active chats',
  })
  getChats(@Param('userId') userId: string) {
    // en realidad vamos a estar autenticados con el usuario no debe entrar por querystring
    return this.chatService.getChats(userId);
  }

  @Post()
  @ApiOperation({
    description: 'Crea un chat',
  })
  new(@Body() dto: CreateChatDto) {
    // en realidad vamos a estar autenticados con el usuario nuestro user no deberia entrar vía body
    return this.chatService.new(dto);
  }
}
