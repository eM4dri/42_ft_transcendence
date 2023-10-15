import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsUUID,
} from 'class-validator'

//model historical_games {
//  gameId        String   @id @default(uuid())
//  gameDate      DateTime @default(now())
//  localId       String    
//  localName     String    
//  visitorId     String    
//  visitorName   String    
//  localGoals    Int      @default(0)
//  visitorGoals  Int      @default(0)
//  winLocal      Boolean
//  winVisitor    Boolean
//  Draw          Boolean
//  pointsLocal   Int      @default(0)
//  pointsVisitor Int      @default(0)
//}
export class Historic_GameDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'localId',
    type: String,
    required: true,
  })
  localId: string

  // @IsNotEmpty()
  // @IsString()
  // @ApiProperty({
  //   name: 'localName',
  //   type: String,
  //   required: true,
  // })
  // localName: string

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'visitorId',
    type: String,
    required: true,
  })
  visitorId: string

  //  @IsNotEmpty()
  //  @IsString()
  //  @ApiProperty({
  //    name: 'visitorName',
  //    type: String,
  //    required: true,
  //  })
  //  visitorName: string

  @IsNumber()
  @ApiProperty({
    name: 'localGoals',
    type: Number,
  })
  localGoals: number

  @IsNumber()
  @ApiProperty({
    name: 'visitorGoals',
    type: Number,
  })
  visitorGoals: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    name: 'winLocal',
    type: Boolean,
    required: true,
  })
  winLocal: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    name: 'winVisitor',
    type: Boolean,
    required: true,
  })
  winVisitor: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    name: 'draw',
    type: Boolean,
    required: true,
  })
  draw: boolean

  @IsNumber()
  @ApiProperty({
    name: 'pointsLocal',
    type: Number,
  })
  pointsLocal: number

  @IsNumber()
  @ApiProperty({
    name: 'pointsLocal',
    type: Number,
  })
  pointsVisitor: number
}
