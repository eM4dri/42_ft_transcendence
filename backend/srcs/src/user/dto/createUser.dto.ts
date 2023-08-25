import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
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
}
