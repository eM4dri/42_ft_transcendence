import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class BlockedUserDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'userId_blocked',
    type: String,
    required: true,
  })
  userId_blocked: string;
}