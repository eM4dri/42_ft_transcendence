import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelAdminService } from './admin/channel.admin.service';
import { ChannelAdminController } from './admin/channel.admin.controller';

@Module({
  controllers: [ChannelController, ChannelAdminController],
  providers: [ChannelService, ChannelAdminService],
})
export class ChannelModule {}
