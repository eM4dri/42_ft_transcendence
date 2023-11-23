import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { HistoricGamesService } from 'src/historic_games/historic_games.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [
    GameService,
    GameGateway,
    HistoricGamesService,
    AuthService,
    JwtService
  ]
})
export class GameModule {}
