import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,  IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'user1',
    type: String,
    required: true,
  })
  user1: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'user2',
    type: String,
    required: true,
  })
  user2: string;
}
