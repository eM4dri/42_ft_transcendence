import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  Length
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'id42',
    type: Number,
    required: true,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  @ApiProperty({
    name: 'username',
    type: String,
    required: true,
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 30)
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    name: 'url',
    type: String,
    required: true,
  })
  url: string;

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
  @ApiProperty({
    name: 'twofa',
    type: Boolean,
    required: false,
  })
  twofa: boolean;
}
