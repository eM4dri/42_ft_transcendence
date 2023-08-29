import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import {
  CreateChatMessageDto,
  UpdateChatMessageDto,
} from './dto';
import { ChatUserMessage } from '@prisma/client';

@Controller('chat')
@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @ApiOperation({
    description: 'Get all users active chats',
  })
  getAllChats(@GetUser('id') userId: string) {
    return this.chatService.getChats(userId);
  }

  @Get(':uuid')
  @ApiOperation({
    description: 'Get all users active chats',
  })
  getChatMessages(
    @Param('uuid', new ParseUUIDPipe()) chatId: string,
  ) {
    return this.chatService.getChatMessages(
      chatId,
    );
  }

  @Post('/message')
  @ApiOperation({
    description: 'Manda un mensaje',
  })
  @ApiBody({
    type: CreateChatMessageDto,
    description:
      'Crea un mensaje CreateChatMessageDto',
    examples: {
      example1: {
        value: {
          listenerId:
            '00000000-0000-0000-0000-000000000000',
          message: 'Hi! this is a message from 0',
          chatId:
            '00000000-0000-0000-0000-000000000000',
        },
      },
      example2: {
        value: {
          listenerId:
            '00000000-0000-0000-0000-000000000000',
          message: 'Hi! this is another message',
        },
      },
    },
  })
  newMessage(
    @GetUser('id') talker: string,
    @Body() dto: CreateChatMessageDto,
  ) {
    return this.chatService.newChatMessage(
      talker,
      dto,
    );
  }

  @Put('/message')
  @ApiBody({
    type: UpdateChatMessageDto,
    description:
      'Actualiza un mensaje UpdateChatMessageDto',
    examples: {
      example1: {
        value: {
          chatMessageId:
            '00000000-0000-0000-0000-000000000000',
          message: 'Hi! this a message UPDATED',
        },
      },
    },
  })
  updateMessage(
    @Body() dto: UpdateChatMessageDto,
  ) {
    return this.chatService.updateChatMessage(
      dto,
    );
  }

  @Delete('/message/:uuid')
  deleteMessage(
    @Param('uuid', new ParseUUIDPipe()) msgId: string,
  ): Promise<ChatUserMessage> {
    return this.chatService.deleteChatMessage(msgId);
  }
}
