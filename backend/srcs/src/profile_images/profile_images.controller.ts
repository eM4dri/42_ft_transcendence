import { Controller,
    UseGuards,
    Body,
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
import {
  userFileUploadDto,
  userUrlUploadDto,
  channelFileUploadDto,
  channelUrlUploadDto
} from './dto';

@Controller('profile-images')
@ApiTags('profile-images')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ProfileImagesController {
    constructor(private ProfileImagesService: ProfileImagesService) {};

    // see https://stackoverflow.com/questions/73824060/how-can-i-validate-a-file-type-using-nestjs-pipes-and-filetypevalidator
    @Post('users/upload_file')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'profile image',
      type: userFileUploadDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    UploadUserProfileImageAsFile( @GetUser('id') userId: string,
                        @UploadedFile(
                          new ParseFilePipe({
                            validators: [
                              new MaxFileSizeValidator({ maxSize: 1000000 }), // 1 MB
                              new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
                            ],
                          }),
                        ) file: Express.Multer.File) {
      return this.ProfileImagesService.uploadProfileImageAsFile(userId, file, "user");
    }

    @Post('users/upload_url')
    @ApiBody({
      description: 'profile image',
      type: userUrlUploadDto,
    })
    UploadUserProfileImageAsUrl( @GetUser('id') userId: string,
                                 @Body() dto : userUrlUploadDto)
    {
      return this.ProfileImagesService.uploadProfileImageAsUrl(userId, dto.url, "user");
    }

    @Post('channels/upload_file')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'profile image',
      type: channelFileUploadDto,
    })
    @UseInterceptors(FileInterceptor('file'))
    UploadChannelProfileImageAsFile( @Body() dto : channelFileUploadDto,
                              @UploadedFile(
                                new ParseFilePipe({
                                  validators: [
                                    new MaxFileSizeValidator({ maxSize: 1000000 }), // 1 MB
                                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
                                  ],
                                }),
                              ) file: Express.Multer.File) {
      return this.ProfileImagesService.uploadProfileImageAsFile(dto.channelId, file, "channel");
    }

    @Post('channels/upload_url')
    @ApiConsumes('application/json')
    @ApiBody({
      description: 'profile image',
      type: channelUrlUploadDto,
    })
    UploadChannelProfileImageAsUrl( @Body() dto : channelUrlUploadDto )
    {
      return this.ProfileImagesService.uploadProfileImageAsUrl(dto.channelId, dto.url, "channel");
    }

}
