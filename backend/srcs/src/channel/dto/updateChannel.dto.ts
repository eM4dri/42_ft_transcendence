import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateChannelDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        name: 'currentPassword',
        type: String,
        required: true,
    })
    currentPassword?: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        name: 'password',
        type: String,
        required: false,
    })
    password: string;
}
