import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChannelDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        name: 'channelName',
        type: String,
        required: true,
    })
    channelName: string;
    
    @IsOptional()
    @IsString()
    @ApiProperty({
        name: 'password',
        type: String,
        required: false,
    })
    password?: string;
}
