import {
  Post,
  Body,
  Controller,
  HttpCode
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger'

import { Historic_GameDto } from './dto';
import { HistoricGamesService } from './historic_games.service';
@Controller('historic-games')
@ApiTags('historic games')
@ApiBearerAuth()
export class HistoricGamesController {
  constructor(private readonly HistoricGamesService: HistoricGamesService) { }
  @Post()
  @HttpCode(200)
  @ApiOperation({ description: 'Update user stats' })
  @ApiBody({
    type: Historic_GameDto,
    examples: {
      exampleLocalWin: {
        value: {
          localId: '00000000-0000-0000-0000-000000000000',
          localName: 'tommy',
          visitorId: '00000000-0000-0000-0000-000000000001',
          visitorName: 'other',
          localGoals: 5,
          visitorGoals: 2,
          winLocal: true,
          winVisitor: false,
          draw: false,
          pointsLocal: 500,
          pointsVisitor: 150,
        }
      },
      exampleVisitorWin: {
        value: {
          localId: '00000000-0000-0000-0000-000000000000',
          localName: 'tommy',
          visitorId: '00000000-0000-0000-0000-000000000001',
          visitorName: 'other',
          localGoals: 1,
          visitorGoals: 5,
          winLocal: false,
          winVisitor: true,
          draw: false,
          pointsLocal: 100,
          pointsVisitor: 450,
        }
      },
      exampleVisitorDraw: {
        value: {
          localId: '00000000-0000-0000-0000-000000000000',
          localName: 'tommy',
          visitorId: '00000000-0000-0000-0000-000000000001',
          visitorName: 'other',
          localGoals: 5,
          visitorGoals: 5,
          winLocal: false,
          winVisitor: false,
          draw: true,
          pointsLocal: 300,
          pointsVisitor: 300,
        }
      }
    }
  })
  async post_historic_game(@Body() dto: Historic_GameDto) {
    return await this.HistoricGamesService.post_historic(dto);
  }
}
