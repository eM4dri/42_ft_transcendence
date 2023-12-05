import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { JwtGuard } from "src/auth/guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { StatsService } from "./stats.service";
import { Update_statsDto } from "./dto";
import { GetUser } from "src/auth/decorator";
import { stats_user } from "@prisma/client";

@Controller("stats")
@ApiTags("stats")
@ApiBearerAuth()
@Injectable()
@UseGuards(JwtGuard)
export class StatsController {
  constructor(private StatsService: StatsService) { }

  @Get()
  @ApiOperation({ description: "Get stats from one user" })
  get(@GetUser("id") UserId: string) {
    return this.StatsService.getUserStats(UserId);
  }

  @Patch()
  @HttpCode(200)
  @ApiOperation({ description: "Update user stats" })
  @ApiBody({
    type: Update_statsDto,
    examples: {
      exampleWin: {
        value: {
          userId: "00000000-0000-0000-0000-000000000000",
          win: true,
          lose: false,
          draw: false,
          goalsFavor: 3,
          goalsAgainst: 1,
          points: 500,
        },
      },
      exampleLose: {
        value: {
          userId: "00000000-0000-0000-0000-000000000000",
          win: false,
          lose: true,
          draw: false,
          goalsFavor: 2,
          goalsAgainst: 4,
          points: 100,
        },
      },
      exampleDraw: {
        value: {
          userId: "00000000-0000-0000-0000-000000000000",
          win: false,
          lose: false,
          draw: true,
          goalsFavor: 2,
          goalsAgainst: 2,
          points: 200,
        },
      },
      exampleDisconect: {
        value: {
          userId: "00000000-0000-0000-0000-000000000000",
          win: false,
          lose: true,
          draw: false,
          goalsFavor: 0,
          goalsAgainst: 3,
          disconect: true,
          points: -100,
        },
      },
    },
  })
  patch(@Body() dto: Update_statsDto) {
    return this.StatsService.update_stats(dto);
  }

  @Get("position")
  @ApiOperation({ description: "Get user rank position" })
  @ApiQuery({ name: "userid", type: String })
  async get_rank(@Query("userid", ParseUUIDPipe) id: string) {
    return this.StatsService.get_rank(id);
  }

  @Get("rank")
  @ApiOperation({ description: "Get rank list" })
  async get_rank_list(): Promise<{ response: stats_user[] }> {
    const result: Promise<stats_user[]> = this.StatsService.get_rank_list()
    console.log(result)
    return { response: await result };
  }
}
