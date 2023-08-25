import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      this.chatUser.deleteMany(),
      this.chat.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
