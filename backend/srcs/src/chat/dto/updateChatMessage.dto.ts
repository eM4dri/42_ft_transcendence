import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateChatMessageDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'chatMessageId',
    type: String,
    required: true,
  })
  chatMessageId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'message',
    type: String,
    required: true,
  })
  message: string;
}
