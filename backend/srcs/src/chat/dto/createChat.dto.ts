import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'user1',
    type: Number,
    required: true,
  })
  user1: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'user2',
    type: Number,
    required: true,
  })
  user2: number;
}
