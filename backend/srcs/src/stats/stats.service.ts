import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Update_statsDto, ResponseStatsDto } from "./dto";
import { stats_user } from "@prisma/client";
import { plainToInstance } from 'class-transformer';


export interface datas extends stats_user {
  login: string,
  avatar: string,
  position: number,
  total: number
}
@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) { }

  async getUserStats(UserId: string): Promise<stats_user> {
    return await this.prisma.stats_user.findUnique({
      where: {
        userId: UserId,
      },
    });
  }

  async getFullUserStats(UserId: string): Promise<datas> {

    const user_stats = await this.prisma.stats_user.findUnique({
      where: {
        userId: UserId,
      },
    });
    const nameavat = await this.prisma.user.findUnique({
      where: {
        userId: UserId,
      },
      select: {
        username: true,
        avatar: true,
      }
    })
    const position = await this.get_rank(UserId);
    const datas: datas = {
      ...user_stats,
      login: nameavat.username,
      avatar: nameavat.avatar,
      position: position.pos,
      total: position.total,
    }

    return datas;
  }

  async update_stats(dto: Update_statsDto): Promise<{}> {
    let newsts: stats_user = await this.getUserStats(dto.userId);
    newsts.gamesWin += (dto.win ? 1 : 0);
    newsts.gamesLose += (dto.lose ? 1 : 0);
    newsts.gamesDraw += (dto.draw ? 1 : 0);
    newsts.goalsFavor += dto.goalsFavor;
    newsts.goalsAgainst += dto.goalsAgainst;
    newsts.disconect += (dto.disconect ? 1 : 0);
    newsts.points += dto.points;
    try {
      await this.prisma.stats_user.update({
        where: {
          userId: newsts.userId,
        },
        data: {
          ...newsts,
        },
      });
      return { status: 'Update stats!!', };
    } catch (error) {
      throw new BadRequestException('Can not update stats',
        {
          cause: new Error(),
          description: 'Fail in update stats'
        });
    }
  }

  async get_rank(UserId: string): Promise<{ pos: number, total: number }> {
    type response = { userId: string, points: number }
    return this.prisma.stats_user.findMany({
      select: {
        userId: true,
        points: true
      },
      orderBy: {
        points: 'desc',
      },
    }).then((data: response[]): { pos: number, total: number } => {
      let position: number = data.map(e => e.userId).indexOf(UserId) + 1;
      let total: number = data.length;
      return { pos: position, total: total }
    });
  }

  async get_rank_list(): Promise<any> {
    const result_data: stats_user[] = await this.prisma.stats_user.findMany({
      orderBy: { points: 'desc' },
    });

    const Ids = Array.from(result_data.map(x => x.userId));

    const users_data = await plainToInstance(ResponseStatsDto, await this.prisma.user.findMany({
      where: {
        userId: { in: Ids },
      },
    }));
    const result = await result_data.map((datas) => {
      const local = users_data.filter((user) => user.userId == datas.userId)[0]
      return {
        userId: datas.userId,
        login: local.username,
        avatar: local.avatar,
        gamesWin: datas.gamesWin,
        gamesLose: datas.gamesLose,
        gamesDraw: datas.gamesDraw,
        goalsFavor: datas.goalsFavor,
        goalsAgainst: datas.goalsAgainst,
        disconect: datas.disconect,
        points: datas.points,
      }
    })
    return result;
  }

  async get_number_rank_user(): Promise<number> {
    return await this.prisma.stats_user.count()
  }
}
