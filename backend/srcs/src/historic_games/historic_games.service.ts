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
      where: { userId: dto.localId },
      select: { username: true }
    }).then((name): string => {
      return name.username;
    });
    const visitor_name = await this.prisma.user.findUnique({
      where: { userId: dto.visitorId },
      select: { username: true }
    }).then((name): string => {
      return name.username;
    });
    console.log(local_name);
    console.log(visitor_name);

    if (local_name === null || visitor_name === null) {
      console.log("FAIL local or visitor name not found")
    }

    await this.prisma.historical_games.create({
      data: {
        localName: local_name,
        visitorName: visitor_name,
        ...dto
      }
    })
  }
}
