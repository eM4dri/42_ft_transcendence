import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsUUID,
  } from 'class-validator';

export class channelFileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
      name : 'channelId',
      type: 'string',
      required: true,
    })
    channelId: string;
}