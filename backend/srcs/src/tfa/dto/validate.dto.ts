import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
} from 'class-validator'

export class ValidateDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'userid',
    type: String,
    required: true,
  })
  userid: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'token',
    type: String,
    required: true,
  })
  token: string
}
