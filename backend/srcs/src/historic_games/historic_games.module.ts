import { Module } from '@nestjs/common';
import { HistoricGamesController } from './historic_games.controller';
import { HistoricGamesService } from './historic_games.service';
import { stats_user } from "@prisma/client";

@Module({
  controllers: [HistoricGamesController],
  providers: [HistoricGamesService]
})
export class HistoricGamesModule { }
