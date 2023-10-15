import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Update_statsDto } from "./dto";
import { stats_user } from "@prisma/client";


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

  async get_rank_list(skip: number, take: number): Promise<{ skip: number, take: number, result: stats_user[] }> {
    const result: stats_user[] = await this.prisma.stats_user.findMany({
      orderBy: { points: 'desc' },
      skip: skip,
      take: take,
    });
    return { skip: skip, take: take, result: result }
  }

  async get_number_rank_user(): Promise<number> {
    return await this.prisma.stats_user.count()
  }
}
