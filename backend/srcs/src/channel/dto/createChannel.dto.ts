import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class CreateChannelDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
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
