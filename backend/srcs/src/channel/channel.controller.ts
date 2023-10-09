import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { ChannelService } from './channel.service';
import { CreateChannelDto, CreateChannelMessageDto, JoinChannelDto } from './dto';

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

    @Get(':uuid/users')
    @ApiOperation({
      description: 'Get channel users',
    })
    getChannelUsers(
      @Param('uuid', new ParseUUIDPipe()) chatId: string,
    ) {
      return this.channelService.getChannelUsers(
        chatId,
      );
    }

    @Get(':uuid/messages')
    @ApiOperation({
      description: 'Get channel messages',
    })
    getChannelMessages(
      @Param('uuid', new ParseUUIDPipe()) chatId: string,
    ) {
      return this.channelService.getChannelMessages(
        chatId,
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
