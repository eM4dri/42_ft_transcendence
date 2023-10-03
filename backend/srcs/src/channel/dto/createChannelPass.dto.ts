import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChannelPassDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
      name: 'channelId',
      type: String,
      required: true,
    })
    channelId: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        name: 'password',
        type: String,
        required: true,
    })
    password: string;
}
