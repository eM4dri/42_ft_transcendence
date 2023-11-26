import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class FriendDto {

  @IsString()
  @ApiProperty({
    name: 'friendId',
    type: String,
    required: true,
  })
  friendId: string;
}
