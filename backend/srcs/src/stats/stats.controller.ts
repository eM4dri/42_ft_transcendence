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
  Param
} from "@nestjs/common";

import { JwtGuard } from "../auth/guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { StatsService } from "./stats.service";
import { Update_statsDto } from "./dto";
import { GetUser } from "../auth/decorator";
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

  @Get('list/:uuid')
  @ApiParam({
    name: "uuid",
    type: String,
    required: true,
    description: "Uuid of the user",
    example: "903af193-666f-47eb-9b37-35ca3d58d4ec",
  })
  @ApiOperation({ description: "Get stats by user id" })
  async getFullById(@Param('uuid', new ParseUUIDPipe()) UserId: string) {
    const res = this.StatsService.getFullUserStats(UserId);
    return { response: await res }
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
    return { response: await result };
  }

  @Get(':uuid')
  @ApiParam({
    name: "uuid",
    type: String,
    required: true,
    description: "Uuid of the user",
    example: "903af193-666f-47eb-9b37-35ca3d58d4ec",
  })
  @ApiOperation({ description: "Get stats by user id" })
  getById(@Param('uuid', new ParseUUIDPipe()) UserId: string) {
    return this.StatsService.getUserStats(UserId);
  }

}
