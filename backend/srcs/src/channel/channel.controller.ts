import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { ChannelService } from './channel.service';
import { CreateChannelDto, MuteChannelUserDto, CreateChannelPassDto, JoinChannelDto } from './dto';


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
 
    @Get('/availables')
    @ApiOperation({
        description: 'Get all available channels for the user',
    })
    getAllChats(@GetUser('id') userId: string) {
      return this.channelService.getChannelsByUserId(userId);
    }

    @Post()
    newChannel(
      @GetUser('id') creator: string,
      @Body() dto: CreateChannelDto,
    ) {
      return this.channelService.newChannel(
        creator,
        dto,
      );
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
    joinChannel(
      @GetUser('id') userId: string,
      @Body() dto: JoinChannelDto
    ) {
      return this.channelService.joinChannel(
        userId,
        dto
      );
    }

    @Patch('/leave/:uuid')
    leaveChannel(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.leaveChannel(
        channelUserId
      );
    }

    @Patch('/user/demote/:uuid')
    demote(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.demoteChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/user/promote/:uuid')
    promote(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.promoteChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/user/ban/:uuid')
    ban(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.banChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/user/unban/:uuid')
    unBan(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.unBanChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/user/mute')
    mute(
      @GetUser('id') channelAdmin: string,
      @Body() dto: MuteChannelUserDto
    ) {
      return this.channelService.muteChannelUser(
        dto,
        channelAdmin,
      );
    }

    @Patch('/user/unmute/:uuid')
    unMute(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.unMuteChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/user/kick/:uuid')
    kick(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelService.kickChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/pass')
    setChannelPass(
      @GetUser('id') channelOwner: string,
      @Body() dto: CreateChannelPassDto
    ) {
      return this.channelService.setChannelPass(
        dto,
        channelOwner,
      );
    }



}
