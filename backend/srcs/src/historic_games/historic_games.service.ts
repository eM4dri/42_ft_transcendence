import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { Historic_GameDto } from './dto';
//import { HistoricGamesController } from './historic_games.controller';
//import { historical_games } from "@prisma/client";

@Injectable()
export class HistoricGamesService {
  constructor(private prisma: PrismaService) { }

  async post_historic(dto: Historic_GameDto) {
    const local_name = await this.prisma.user.findUnique({
      where: {
        userId: dto.localId,
      }
    });
    const visitor_name = await this.prisma.user.findUnique({
      where: {
        userId: dto.visitorId,
      }
    })

    await this.prisma.historical_games.create({
      data: {
        ...dtoa
      }
    })
  }
}
