import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChatMessageDtoWs {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'talkerId',
    type: String,
    required: true,
  })
  talkerId: string;
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'listenerId',
    type: String,
    required: true,
  })
  listenerId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'message',
    type: String,
    required: true,
  })
  message: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    name: 'chatId',
    type: String,
    required: false,
  })
  chatId: string;
}
