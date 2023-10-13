import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { Historic_GameDto } from './dto';
import { historical_games } from "@prisma/client";

@Injectable()
export class HistoricGamesService {
  constructor(private prisma: PrismaService) { }
}
