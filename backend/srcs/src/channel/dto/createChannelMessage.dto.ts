import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChannelMessageDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'channelId',
    type: String,
    required: true,
  })
  channelId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'message',
    type: String,
    required: true,
  })
  message: string;
}
