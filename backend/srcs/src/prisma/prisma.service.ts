import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DB_URL,
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.bannedList.deleteMany(),
      this.blockedList.deleteMany(),
      this.friendsList.deleteMany(),
      this.stats_user.deleteMany(),
      this.historical_games.deleteMany(),
      this.channelUserMessage.deleteMany(),
      this.channelUser.deleteMany(),
      this.channel.deleteMany(),
      this.chatUserMessage.deleteMany(),
      this.chatUser.deleteMany(),
      this.chat.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
