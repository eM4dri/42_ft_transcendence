import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ChannelAdminService } from 'src/channel/admin/channel.admin.service';
import { UserModule } from 'src/user/user.module';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ChannelAdminService, ChannelService]
})
export class AdminModule {}
