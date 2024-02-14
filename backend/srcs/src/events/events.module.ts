import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service';
import { ChannelService } from '../channel/channel.service';
import { JwtService } from '@nestjs/jwt';
import { ChannelAdminService } from '../channel/admin/channel.admin.service';
import { BlockService } from '../block/block.service';
import { UserService } from '../user/user.service';
import { UserFriendsService } from '../user/friends/user.friends.service';

@Module({
  providers: [
    EventsGateway,
    AuthService,
    ChatService,
    JwtService,
    ChannelService,
    ChannelAdminService,
    BlockService,
    UserService,
    UserFriendsService
  ],
})
export class EventsModule {}