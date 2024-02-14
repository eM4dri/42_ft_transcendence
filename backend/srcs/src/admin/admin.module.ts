import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ChannelAdminService } from '../channel/admin/channel.admin.service';
import { UserModule } from '../user/user.module';
import { ChannelService } from '../channel/channel.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ChannelAdminService, ChannelService]
})
export class AdminModule {}
