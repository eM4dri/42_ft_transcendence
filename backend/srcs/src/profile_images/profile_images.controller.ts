import { Controller,
    UseGuards,
    Get,
    Post,
    Delete,
    Patch,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiTags,
    ApiConsumes,
  } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { ProfileImagesService } from './profile_images.service';
import { FileUploadDto } from './dto';

@Controller('profile-images')
@ApiTags('profile-images')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ProfileImagesController {
    constructor(private ProfileImagesService: ProfileImagesService) {};

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'profile image',
      type: FileUploadDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    UploadProfileImage( @GetUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
      return this.ProfileImagesService.uploadProfileImage(userId, file);
    }

    @Patch('roll')
    rollProfileImage( @GetUser('id') userId: string) {
      return this.ProfileImagesService.rollProfileImage(userId);
    }

    @Get()
    getProfileImage(@GetUser('id') userId: string) {
      return this.ProfileImagesService.getProfileImageUrl(userId);
    }
  
    @Delete()
    deleteProfileImage(@GetUser('id') userId: string) {
      return this.ProfileImagesService.deleteProfileImage(userId);
    }

}
