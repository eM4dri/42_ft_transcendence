import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { Historic_GameDto, ResponseHistoricGamesUserDto } from './dto';
import { historical_games } from "@prisma/client";
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HistoricGamesService {
  constructor(private prisma: PrismaService) { }

  async post_historic(dto: Historic_GameDto): Promise<historical_games> {
    try {
      const local_name = await this.prisma.user.findUnique({
        where: { userId: dto.localId },
        select: { username: true }
      }).then((name: { username: string }): string => {
        return name.username;
      });
      const visitor_name = await this.prisma.user.findUnique({
        where: { userId: dto.visitorId },
        select: { username: true }
      }).then((name: { username: string }): string => {
        return name.username;
      });

      return await this.prisma.historical_games.create({
        data: {
          localName: local_name,
          visitorName: visitor_name,
          ...dto
        }
      })
    } catch (error) {
      throw new NotFoundException('Some user not found');
    }
  }

  async total_num_historic_by_user(userId: string): Promise<number> {
    return this.prisma.historical_games.count({
      where: {
        OR: [
          { localId: userId },
          { visitorId: userId }
        ]
      }
    })
  }

  async get_historic(userId: string, skip: number, take: number) {
    if (await this.prisma.user.findUnique({ where: { userId: userId } }) === null) {
      throw new NotFoundException('User not found')
    }

    let historical_games = await this.prisma.historical_games.findMany({
      where: {
        OR: [
          { localId: userId },
          { visitorId: userId }
        ]
      },
      orderBy: { gameDate: 'desc' },
      //skip: skip,
      //take: take,
    })
    const localIds = Array.from(historical_games.map(x => x.localId));
    const visitorsIds = Array.from(historical_games.map(x => x.visitorId));
    const userIds = localIds.concat(visitorsIds);
    const users = await plainToInstance(ResponseHistoricGamesUserDto, await this.prisma.user.findMany({
      where: {
        userId: { in: userIds },
      },
    }));

    const result = await historical_games.map((game) => {
      const local = users.filter(
        (user) =>
          user.userId == game.localId,
      )[0];
      const visitor = users.filter(
        (user) =>
          user.userId == game.visitorId,
      )[0];
      return {
        gameId: game.gameId,
        gameDate: game.gameDate,
        competitive: game.competitive,
        modded: game.modded,
        localId: local.userId,
        localName: local.username,
        localAvatar: local.avatar,
        visitorId: visitor.userId,
        visitorName: visitor.username,
        visitorAvatar: visitor.avatar,
        localGoals: game.localGoals,
        visitorGoals: game.visitorGoals,
        winLocal: game.winLocal,
        winVisitor: game.winVisitor,
        draw: game.draw,
        pointsLocal: game.pointsLocal,
        pointsVisitor: game.pointsVisitor,
      };
    });
    return result;
  }
}

