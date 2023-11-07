import { Module } from '@nestjs/common';
import { ProfileImagesService, RandomStringService } from './profile_images.service';
import { ProfileImagesController } from './profile_images.controller';

@Module({
  providers: [ProfileImagesService, RandomStringService],
  controllers: [ProfileImagesController]
})
export class ProfileImagesModule {}
