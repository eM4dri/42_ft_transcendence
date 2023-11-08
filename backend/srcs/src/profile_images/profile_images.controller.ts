import { Controller,
    UseGuards,
    Get,
    Post,
    Delete,
    Patch,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Param,
    ParseUUIDPipe
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


    // see https://stackoverflow.com/questions/73824060/how-can-i-validate-a-file-type-using-nestjs-pipes-and-filetypevalidator
    @Post('users/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'profile image',
      type: FileUploadDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    UploadProfileImage( @GetUser('id') userId: string,
                        @UploadedFile(
                          new ParseFilePipe({
                            validators: [
                              new MaxFileSizeValidator({ maxSize: 1000000 }), // 1 MB
                              new FileTypeValidator({ fileType: /\.(jpg|jpeg|png|svg)$/ }),
                            ],
                          }),
                        ) file: Express.Multer.File) {
      return this.ProfileImagesService.uploadProfileImage(userId, file);
    }

    @Post('channels/upload_as_file')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'profile image',
      type: FileUploadDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    UploadProfileImageAsFile( @Param('uuid', new ParseUUIDPipe()) channelId: string,
                              @UploadedFile(
                                new ParseFilePipe({
                                  validators: [
                                    new MaxFileSizeValidator({ maxSize: 1000000 }), // 1 MB
                                    new FileTypeValidator({ fileType: /\.(jpg|jpeg|png|svg)$/ }),
                                  ],
                                }),
                              ) file: Express.Multer.File) {
      return this.ProfileImagesService.uploadProfileImageAsFile(channelId, file);
    }

    @Post('channels/upload_as_url')
    UploadProfileImageAsUrl( @Param('uuid', new ParseUUIDPipe()) channelId: string, url: string) {
      return this.ProfileImagesService.uploadProfileImageAsUrl(channelId, url);
    }

    @Patch('users/roll')
    rollProfileImage( @GetUser('id') userId: string) {
      return this.ProfileImagesService.rollProfileImage(userId);
    }

    @Get('users/get')
    getProfileImage(@GetUser('id') userId: string) {
      return this.ProfileImagesService.getProfileImageUrl(userId);
    }

    @Delete('users/delete')
    deleteProfileImage(@GetUser('id') userId: string) {
      return this.ProfileImagesService.deleteProfileImage(userId);
    }

}
