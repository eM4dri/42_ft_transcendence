import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MuteChannelUserDto, CreateChannelPassDto } from '../dto';
import { ChannelAdminService } from './channel.admin.service';


@Controller('channel/admin')
@ApiTags('channel/admin')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChannelAdminController {
    constructor(private channelAdminService: ChannelAdminService) {}

    @Get(':uuid/users')
    @ApiOperation({
      description: 'Get channel users',
    })
    async getChannelUsers(
      @Param('uuid', new ParseUUIDPipe()) chatId: string,
    ) {
      return { response: await this.channelAdminService.getChannelUsers(chatId) };
    }

    @Patch('/demote/:uuid')
    demote(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelAdminService.demoteChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/promote/:uuid')
    promote(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelAdminService.promoteChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/ban/:uuid')
    ban(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelAdminService.banChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/unban/:uuid')
    unBan(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelAdminService.unBanChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/mute')
    mute(
      @GetUser('id') channelAdmin: string,
      @Body() dto: MuteChannelUserDto
    ) {
      return this.channelAdminService.muteChannelUser(
        dto,
        channelAdmin,
      );
    }

    @Patch('/unmute/:uuid')
    unMute(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelAdminService.unMuteChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/kick/:uuid')
    kick(
      @GetUser('id') channelAdmin: string,
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return this.channelAdminService.kickChannelUser(
        channelUserId,
        channelAdmin,
      );
    }

    @Patch('/pass')
    setChannelPass(
      @GetUser('id') channelOwner: string,
      @Body() dto: CreateChannelPassDto
    ) {
      return this.channelAdminService.setChannelPass(
        dto,
        channelOwner,
      );
    }

}
