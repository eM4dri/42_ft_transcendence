import { Module } from '@nestjs/common';
import { UserFriendsController } from './user.friends.controller';
import { UserFriendsService } from './user.friends.service';

@Module({
  controllers: [UserFriendsController],
  providers: [UserFriendsService],
  exports: [UserFriendsService],
})
export class UserFriendsModule {}
