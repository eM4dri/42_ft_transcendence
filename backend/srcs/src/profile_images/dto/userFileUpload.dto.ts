import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
  } from 'class-validator';

export class userFileUploadDto {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}