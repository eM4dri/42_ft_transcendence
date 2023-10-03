import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';

export class MuteChannelUserDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        name: 'channelName',
        type: String,
        required: true,
    })
    channelUserId: string;
    
    @IsNotEmpty()
    @IsDate()
    @ApiProperty({
        name: 'mutedUntill',
        type: Date,
        required: false,
    })
    mutedUntill: Date;
}
