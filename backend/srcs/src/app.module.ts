import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
//import { StatsService } from './stats/stats.service';
//import { StatsController } from './stats/stats.controller';
import { StatsModule } from './stats/stats.module';
import { ChannelModule } from './channel/channel.module';
import { EventsModule } from './events/events.module';
import { HistoricGamesModule } from './historic_games/historic_games.module';
import { BlockModule } from './block/block.module';
import { ProfileImagesModule } from './profile_images/profile_images.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
    PrismaModule,
    StatsModule,
    ChannelModule,
    EventsModule,
    HistoricGamesModule,
    BlockModule,
    ProfileImagesModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
