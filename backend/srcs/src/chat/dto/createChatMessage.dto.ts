import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChatMessageDto {
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
