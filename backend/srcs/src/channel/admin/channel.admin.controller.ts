import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
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
    async demote(
      @GetUser('id') executorUserId: string,
      @Param('uuid', new ParseUUIDPipe()) targetChannnelUserId: string,
    ) {
      return { response: await this.channelAdminService.protectedDemoteChannelUser(
        executorUserId,
        targetChannnelUserId,
        )};
    }

    @Patch('/promote/:uuid')
    async promote(
      @GetUser('id') executorUserId: string,
      @Param('uuid', new ParseUUIDPipe()) targetChannnelUserId: string,
    ) {
      return { response: await this.channelAdminService.protectedPromoteChannelUser(
        executorUserId,
        targetChannnelUserId,
      )};
    }

    @Patch('/ban/:uuid')
    async ban(
      @GetUser('id') executorUserId: string,
      @Param('uuid', new ParseUUIDPipe()) targetChannnelUserId: string,
    ) {
      return { response: await this.channelAdminService.protectedBanChannelUser(
        executorUserId,
        targetChannnelUserId,
        )};
    }

    @Patch('/unban/:uuid')
    async unBan(
      @GetUser('id') executorUserId: string,
      @Param('uuid', new ParseUUIDPipe()) targetChannnelUserId: string,
    ) {
      return { response: await this.channelAdminService.protectedUnBanChannelUser(
        executorUserId,
        targetChannnelUserId,
      )};
    }

    @Patch('/mute')
    async mute(
      @GetUser('id') executorUserId: string,
      @Body() dto: MuteChannelUserDto
    ) {
      return { response : await this.channelAdminService.protectedMuteChannelUser(
        dto,
        executorUserId,
      )};
    }

    @Patch('/unmute/:uuid')
    async unMute(
      @GetUser('id') executorUserId: string,
      @Param('uuid', new ParseUUIDPipe()) targetChannnelUserId: string,
    ) {
      return { response: await this.channelAdminService.protectedUnMuteChannelUser(
        executorUserId,
        targetChannnelUserId,
        )};
    }

    @Patch('/kick/:uuid')
    async kick(
      @GetUser('id') executorUserId: string,
      @Param('uuid', new ParseUUIDPipe()) targetChannnelUserId: string,
    ) {
      return { response: await this.channelAdminService.protectedKickChannelUser(
        executorUserId,
        targetChannnelUserId,
      )};
    }

    @Patch('/pass')
    async setChannelPass(
      @GetUser('id') channelOwner: string,
      @Body() dto: CreateChannelPassDto
    ) {
      return { response: await this.channelAdminService.setChannelPass(
        dto,
        channelOwner,
      )};
    }

}
