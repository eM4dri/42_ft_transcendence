import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileImagesService } from 'src/profile_images/profile_images.service';
import { RandomStringService } from 'src/profile_images/profile_images.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ProfileImagesService, RandomStringService],
  exports: [UserService],
})
export class UserModule {}
