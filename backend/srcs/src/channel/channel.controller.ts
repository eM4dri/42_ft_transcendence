import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { ChannelService } from './channel.service';
import { CreateChannelDto, CreateChannelMessageDto, JoinChannelDto } from './dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';

@Controller('channel')
@ApiTags('channel')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}

    @Get('/all')
    @ApiOperation({
      description: 'Get all channels',
    })
    getAllChannels(@GetUser() user: User) {
        //!validate user is website moderator or website owner
        return this.channelService.getAllChannels();
    }

    @Get('/joined')
    @ApiOperation({
        description: 'Get all available channels for the user',
    })
    getJoinedChannels(@GetUser('id') userId: string) {
      return this.channelService.getChannelsJoinedByUserId(userId);
    }

    @Get('/availables')
    @ApiOperation({
        description: 'Get all available channels for the user',
    })
    async getAvailablesChannels(@GetUser('id') userId: string) {
      return { response: await this.channelService.getChannelsAvailablesByUserId(userId)};
    }

    @Get(':uuid/isLocked')
    @ApiOperation({
        description: 'Get if channel is locked by id',
    })
    @ApiParam({
      name: "uuid",
      type: String,
      required: true,
      description: "Uuid of the channel",
      example: "903af193-666f-47eb-9b37-35ca3d58d4ec",
    })
    async getIsChannelLockedById(@Param('uuid', new ParseUUIDPipe()) channelId: string) {
      console.log(await this.channelService.getFullChannelByChannelId(channelId));
      return { response: (await this.channelService.getChannelByChannelId(channelId)).password !== null ? true : false};
    }

    @Post()
    async newChannel(
      @GetUser('id') creator: string,
      @Body() dto: CreateChannelDto,
    ) {
      return {
        response: await this.channelService.newChannel(
            creator,
            dto,
          )
      };
    }

    @Patch(':uuid')
    async updateChannelPassword(
      @Param('uuid', new ParseUUIDPipe()) channelId: string,
      @Body() dto: UpdateChannelDto,
    ) {
      return {
        response: await this.channelService.updateChannelPassword(
            channelId,
            dto
          )
      };
    }

    @Delete('/:uuid')
    destroyChannel(
      @Param('uuid', new ParseUUIDPipe()) channelId: string,
    ) {
      //!validate user is website moderator or website owner
      return this.channelService.destroyChannel(
        channelId
      );
    }

    @Post('/join')
    async joinChannel(
      @GetUser('id') userId: string,
      @Body() dto: JoinChannelDto
    ) {
      console.log('Hola', dto);
      return { 
        response: await this.channelService.joinChannel(userId, dto )
      };
    }

    @Patch('/leave/:uuid')
    leaveChannel(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.leaveChannel(
        channelUserId
      );
    }

    @Get(':uuid/users')
    @ApiOperation({
      description: 'Get channel users',
    })
    getChannelUsers(
      @Param('uuid', new ParseUUIDPipe()) channelId: string,
    ) {
      return this.channelService.getChannelUsers(
        channelId,
      );
    }

    @Get(':uuid/myuser')
    @ApiOperation({
      description: 'Get channel users',
    })
    getMyUserChannel(
      @GetUser('id') userId: string,
      @Param('uuid', new ParseUUIDPipe()) channelId: string,
    ) {
      return this.channelService.getMyChannelUser(
        channelId, userId
      );
    }

    @Get(':uuid/messages')
    @ApiOperation({
      description: 'Get channel messages',
    })
    getChannelMessages(
      @Param('uuid', new ParseUUIDPipe()) channelId: string,
    ) {
      return this.channelService.getChannelMessages(
        channelId,
      );
    }

    @Post('/message')
    @ApiOperation({
      description: 'Manda un mensaje',
    })
    newChannelMessage(
      @GetUser('id') talker: string,
      @Body() dto: CreateChannelMessageDto,
    ) {
      return this.channelService.newChannelMessage(
        talker,
        dto,
      );
    }
}
