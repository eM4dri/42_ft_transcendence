import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  @Length(1, 10)
  @ApiProperty({
    name: 'username',
    type: String,
    required: false,
  })
  username: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 30)
  @ApiProperty({
    name: 'email',
    type: String,
    required: false,
  })
  email: string;

  @IsString()
  @IsOptional()
  @Length(1, 15)
  @ApiProperty({
    name: 'firstName',
    type: String,
    required: false,
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 15)
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
