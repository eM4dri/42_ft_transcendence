import { Module } from '@nestjs/common';
import { HistoricGamesController } from './historic_games.controller';

@Module({
  controllers: [HistoricGamesController]
})
export class HistoricGamesModule {}
