import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UserModule, ChatModule, PrismaModule, MessageModule],
})
export class AppModule {}
