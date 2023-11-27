import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { HistoricGamesService } from 'src/historic_games/historic_games.service';
import { StatsService } from 'src/stats/stats.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    GameService,
    GameGateway,
    HistoricGamesService,
    StatsService,
    AuthService,
    JwtService, 
    UserService
  ]
})
export class GameModule {}
