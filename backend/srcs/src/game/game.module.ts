import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { HistoricGamesService } from '../historic_games/historic_games.service';
import { StatsService } from '../stats/stats.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from "@nestjs/jwt";
import { UserService } from '../user/user.service';

@Module({
  providers: [
    GameService,
    GameGateway,
    HistoricGamesService,
    StatsService,
    AuthService,
    JwtService, 
    UserService,
    StatsService
  ]
})
export class GameModule {}
