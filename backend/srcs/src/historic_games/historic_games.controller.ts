import {
  Post,
  Get,
  Body,
  Controller,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from "src/auth/guard";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'

import { Historic_GameDto } from './dto';
import { HistoricGamesService } from './historic_games.service';
import { historical_games } from "@prisma/client";
@Controller('historic-games')
@ApiTags('historic games')
@ApiBearerAuth()
@UseGuards(JwtGuard)
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
          visitorId: '00000000-0000-0000-0000-000000000001',
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
          visitorId: '00000000-0000-0000-0000-000000000001',
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
          visitorId: '00000000-0000-0000-0000-000000000001',
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
  async post_historic_game(@Body() dto: Historic_GameDto): Promise<historical_games> {
    return await this.HistoricGamesService.post_historic(dto);
  }

  @Get()
  @ApiOperation({ description: "Get historic games by user" })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @HttpCode(200)
  async get_historic_by_user(
    @Query('userId') userId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    const t: number = await this.HistoricGamesService.total_num_historic_by_user(userId);
    if (isNaN(skip) || isNaN(take)) {
      skip = 0;
      take = 10;
    }

    if (skip < 0 || take < 0) {
      skip = 0;
      take = 10;
    }

    if ((skip + take) > t) {
      skip = 0;
      if (take > t) {
        take = t;
      } else {
        take = 10;
      }
    }
    const result = await this.HistoricGamesService.get_historic(userId, skip, take)
      .then((result) => {
        return { total: t, skip: skip, take: take, result: result };
      });
    return { response: await result }
  }
}
