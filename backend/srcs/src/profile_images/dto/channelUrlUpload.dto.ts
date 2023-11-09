import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
  } from 'class-validator';

export class channelUrlUploadDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
      name : 'channelId',
      type: 'string',
      required: true,
    })
    channelId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        name: 'url',
        type: 'string',
        required: true,
    })
    url : string;
}