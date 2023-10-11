import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsBoolean,
  IsUUID,
} from 'class-validator'

export class Update_statsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'userId',
    type: String,
    required: true,
  })
  userId: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    name: 'win',
    type: Boolean,
    required: true,
  })
  win: boolean

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    name: 'lose',
    type: Boolean,
    required: true,
  })
  lose: boolean

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    name: 'draw',
    type: Boolean,
    required: true,
  })
  draw: boolean

  @IsNotEmpty()
  @ApiProperty({
    name: 'goalsFavor',
    type: Intl,
    required: true,
  })
  goalsFavor: number

  @IsNotEmpty()
  @ApiProperty({
    name: 'goalsAgainst',
    type: Intl,
    required: true,
  })
  goalsAgainst: number

  @IsBoolean()
  @ApiProperty({
    name: 'disconect',
    type: Boolean,
    required: true,
  })
  disconect: boolean = false

  @IsNotEmpty()
  @ApiProperty({
    name: 'points',
    type: Intl,
    required: true,
  })
  points: number
}
