import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { Historic_GameDto } from './dto';
import { historical_games } from "@prisma/client";

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
}
