import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';

export class MuteChannelUserDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        name: 'channelUserId',
        type: String,
        required: true,
    })
    channelUserId: string;
    
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({
        name: 'mutedUntill',
        type: Date,
        required: false,
    })
    mutedUntill: Date;
}
