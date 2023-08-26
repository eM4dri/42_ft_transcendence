import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
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
  @ApiProperty({
    name: 'username',
    type: String,
    required: true,
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
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
}
