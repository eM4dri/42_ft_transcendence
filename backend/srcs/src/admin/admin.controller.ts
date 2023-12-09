import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MuteChannelUserDto, CreateChannelPassDto } from '../channel/dto';
import { ChannelAdminService } from '../channel/admin/channel.admin.service';
import { RoleguardGuard } from 'src/auth/roleguard/roleguard.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AdminService } from './admin.service';

// No confundir admin/channel con channel/admin.
// admin/channel son cosas que un admin hace, que pueden tener que ver con canales.
// channel/admin son cosas que un admin de canal hace, en exclusiva, en el canal que administra.
@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class AdminController {
    constructor(private channelAdminService: ChannelAdminService,
                private adminService: AdminService)
    {}

    @Get('/all/extendedusers')
    @Roles(Role.Owner, Role.Admin)
    @ApiOperation({
      description: 'Get banned list',
    })
    async getExtendedUsers()
    {
      return { response: await this.adminService.allExtendedUsers() };
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                    Promote / Demote (Globally)                *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    @Patch('/promote/:uuid')
    @Roles(Role.Owner)
    @ApiOperation({
      description: 'Owners: promote a user',
    })
    async promoteUser(
      @Param('uuid', new ParseUUIDPipe()) userId: string,
    ) {
      return { response: await this.adminService.promoteUser(userId) };
    }


    @Patch('/demote/:uuid')
    @Roles(Role.Owner)
    @ApiOperation({
      description: 'Owners: demote a User',
    })
    async demoteUser(
      @Param('uuid', new ParseUUIDPipe()) userId: string,
    ) {
      return { response: await this.adminService.demoteUser(userId) };
    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                    Ban / UnBan (Globally)                     *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    @Patch('/ban/:uuid')
    @Roles(Role.Admin, Role.Owner)
    @ApiOperation({
      description: 'Admin/Owners: ban a user ',
    })
    async banUser(
      @Param('uuid', new ParseUUIDPipe()) userId: string,
    ) {
      return { response: await this.adminService.banUser(userId) };
    }

    @Patch('/unban/:uuid')
    @Roles(Role.Admin, Role.Owner)
    @ApiOperation({
      description: 'Admin/Owners: unban a user',
    })
    async unBanUser(
      @Param('uuid', new ParseUUIDPipe()) userId: string,
    ) {
      return { response: await this.adminService.unBanUser(userId) };
    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                        Channel Actions                        *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    @Get('/channel/:uuid/users')
    @Roles(Role.Admin, Role.Owner)
    @ApiOperation({
      description: 'Get channel users',
    })
    async getChannelUsers(
      @Param('uuid', new ParseUUIDPipe()) chatId: string,
    ) {
      return { response: await this.channelAdminService.getChannelUsers(chatId) };
    }

    @Patch('/channel/demote/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async demote(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return { response: await this.channelAdminService.demoteChannelUser(
        channelUserId,
        )};
    }

    @Patch('/channel/promote/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async promote(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return { response: await this.channelAdminService.promoteChannelUser(
        channelUserId,
      )};
    }

    @Patch('/channel/ban/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async ban(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return { response: await this.channelAdminService.banChannelUser(
        channelUserId,
        )};
    }

    @Patch('/channel/unban/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async unBan(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return { response: await this.channelAdminService.unBanChannelUser(
        channelUserId,
      )};
    }

    @Patch('/channel/mute/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async mute(
      @Body() dto: MuteChannelUserDto
    ) {
      return { response : await this.channelAdminService.muteChannelUser(
        dto,
      )};
    }

    @Patch('/channel/unmute/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async unMute(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return { response: await this.channelAdminService.unMuteChannelUser(
        channelUserId,
        )};
    }

    @Patch('/channel/kick/:uuid')
    @Roles(Role.Admin, Role.Owner)
    async kick(
      @Param('uuid', new ParseUUIDPipe()) channelUserId: string,
    ) {
      return { response: await this.channelAdminService.kickChannelUser(
        channelUserId,
        )};
    }

}
