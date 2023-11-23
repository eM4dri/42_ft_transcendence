import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'username',
    type: String,
    required: false,
  })
  username: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    name: 'email',
    type: String,
    required: false,
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'firstName',
    type: String,
    required: false,
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'lastName',
    type: String,
    required: false,
  })
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    name: 'twofa',
    type: Boolean,
    required: false,
  })
  twofa?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'twofa_code',
    type: String,
    required: false,
  })
  twofa_code: string;
}
