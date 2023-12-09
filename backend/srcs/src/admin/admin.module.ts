import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ChannelAdminService } from 'src/channel/admin/channel.admin.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ChannelAdminService]
})
export class AdminModule {}
