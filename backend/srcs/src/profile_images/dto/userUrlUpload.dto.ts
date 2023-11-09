import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class userUrlUploadDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        name: 'url',
        type: String,
        required: true,
    })
    url : string;
}