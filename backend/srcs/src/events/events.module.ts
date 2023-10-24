import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { ChannelService } from 'src/channel/channel.service';
import { JwtService } from '@nestjs/jwt';
import { ChannelAdminService } from 'src/channel/admin/channel.admin.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    EventsGateway,
    AuthService,
    ChatService,
    JwtService,
    ChannelService,
    ChannelAdminService,
    UserService
  ],
})
export class EventsModule {}