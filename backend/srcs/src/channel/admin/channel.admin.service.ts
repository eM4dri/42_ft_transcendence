import { ForbiddenException,  Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {  MuteChannelUserDto, CreateChannelPassDto, ResponseChannelUserDto } from '../dto';
import { ChannelUser } from '@prisma/client';
import * as argon from 'argon2';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { ResponseUserMinDto } from 'src/user/dto';

export enum ChannelRol {
    USER,
    ADMIN,
    OWNER,
}

// CYAB NORMA : ADMIN ARG[0], USER ARG[1]
// (En el controller se hace igual)
@Injectable()
export class ChannelAdminService {

    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ){
    }

    /*
     * LA RAZON POR LA QUE ESTO ES TAN RARO:
     *
     * Executor: userId
     * Target: channelUserId
     *
     * ===> El userId del executor, de forma directa, no nos sirve de nada.
     * ===> Se necesita conseguir el channelUserId del Executor para comprobar permisos.
     */

    private async _getChannelIdFromChannelUserId(channelUserId: string) {
        const channelUser: ChannelUser = (await this.prisma.channelUser.findUniqueOrThrow({
            where: { channelUserId: channelUserId, }
        }));
        return channelUser.channelId;
    }

    private async _getChannelUserIdFromChannelIdAndUserId(userId: string, channelId: string) {
        const channelUser: ChannelUser = await this.prisma.channelUser.findFirstOrThrow({
            where: {
                channelId: channelId,
                userId: userId,
                leaveAt: null
            }
        });
        return channelUser.channelUserId;
    }

    private async _userIsChannelRole(userId: string, anyChannelUserId: string, role: ChannelRol) {
        const channelId : string = await this._getChannelIdFromChannelUserId(anyChannelUserId);
        const channelUserId : string = await this._getChannelUserIdFromChannelIdAndUserId(userId, channelId);
        return this._channelUserIsChannelRole(channelUserId, role);
    }

    private async _getChannelRoleFromChannelUserId(channelUserId: string) {
        const channelUser : ChannelUser = (await this.prisma.channelUser.findUniqueOrThrow({
            where: { channelUserId: channelUserId, }
        }));
        if (channelUser.isOwner) {
            return ChannelRol.OWNER;
        } else if (channelUser.isAdmin) {
            return ChannelRol.ADMIN;
        }
        return ChannelRol.USER;
    }

    private async _channelUserIsChannelRole(channelUserId: string, role: ChannelRol) {
        //console.log("me piden el role", role);
        //console.log("ahh pero usted posee el rol ", await this._getChannelRoleFromChannelUserId(channelUserId));
        return await this._getChannelRoleFromChannelUserId(channelUserId) === role;
    }

    async getChannelUsers(channelId: string) {
        try {
            return await this.prisma.channelUser.findMany({
                where: { channelId: channelId }
            });
        } catch (error) {
            throw (error);
        }
    }

    async getChannelMessages(channelId: string) {
        try {
            const channelUsersRaw = await this.getChannelUsers(channelId);
            const channelUserIds: string[] = channelUsersRaw.map(x=>x.channelUserId).filter(x=>x);
            const userIds: string[] = channelUsersRaw.map(x=>x.userId).filter(x=>x);
            const channelMessages = plainToInstance( ResponseChannelUserDto, await this.prisma.channelUserMessage.findMany({
                where:{ channelUserId: { in: channelUserIds } }
            }));
            const users = plainToInstance(ResponseUserMinDto, await this.prisma.user.findMany({
                where:{ userId: { in: userIds } }
            }));
            const channelUsers = await channelUsersRaw.map((channelUser) => {
                const user = users.filter((user) => user.userId == channelUser.userId)[0];
                return {
                    channelId: channelUser.channelId,
                    channelUserId: channelUser.channelUserId,
                    userId: channelUser.userId,
                    joinedAt: channelUser.joinedAt,
                    leaveAt: channelUser.leaveAt,
                    user: user,
                }
            });
            return {channelUsers: channelUsers, channelMessages: channelMessages};
        } catch (error) {
            throw (error);
        }
    }
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                 Admin/Owner interface                     *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    async demoteChannelUser(channelUserId: string) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isAdmin: false }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async promoteChannelUser(channelUserId: string) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isAdmin: true }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async banChannelUser(channelUserId: string) {
        try {
            const channelUser : ChannelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: {
                        isBanned: true,
                        leaveAt: new Date(Date.now()),
                    }
            });
            this.eventEmitter.emit('channel_user_leaves', channelUser);
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async unBanChannelUser(channelUserId: string) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isBanned: false }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async muteChannelUser(dto: MuteChannelUserDto) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: dto.channelUserId, },
                data: { mutedUntill: dto.mutedUntill }
            });
            this.eventEmitter.emit('update_channel_user', channelUser);
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async unMuteChannelUser(channelUserId: string) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { mutedUntill: null }
            });
            this.eventEmitter.emit('update_channel_user', channelUser);
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async kickChannelUser(channelUserId: string) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                            where: { channelUserId: channelUserId, },
                            data: { leaveAt: new Date( Date.now() ) }
                        });
            this.eventEmitter.emit('channel_user_leaves', channelUser);
            this.reOwningChannel(channelUser.channelId);
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *             Protected interface                           *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // ANY ACTION CAN ONLY BE DONE OVER Users, Except Demoting, which is ONLY
    // done over Admins.

    // Only Owners.
    async protectedDemoteChannelUser(executorUserId: string, targetChannelUserId: string) {
        try {
            if (await this._userIsChannelRole(executorUserId, targetChannelUserId, ChannelRol.OWNER)
                && await this._channelUserIsChannelRole(targetChannelUserId, ChannelRol.ADMIN))
            {
                return await this.demoteChannelUser(targetChannelUserId);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async protectedPromoteChannelUser(executorUserId: string, targetChannelUserId: string) {
        try {
            if (await this._userIsChannelRole(executorUserId, targetChannelUserId, ChannelRol.OWNER)
                && await this._channelUserIsChannelRole(targetChannelUserId, ChannelRol.USER))
            {
                return await this.promoteChannelUser(targetChannelUserId);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async protectedBanChannelUser(executorUserId: string, targetChannelUserId: string) {
        try {
            if ((!await this._userIsChannelRole(executorUserId, targetChannelUserId, ChannelRol.USER))
                && await this._channelUserIsChannelRole(targetChannelUserId, ChannelRol.USER))
            {
                return await this.banChannelUser(targetChannelUserId);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async protectedUnBanChannelUser(executorUserId: string, targetChannelUserId: string) {
        try {
            if ((!await this._userIsChannelRole(executorUserId, targetChannelUserId, ChannelRol.USER))
                && await this._channelUserIsChannelRole(targetChannelUserId, ChannelRol.USER))
            {
                return await this.unBanChannelUser(targetChannelUserId);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async protectedMuteChannelUser(dto: MuteChannelUserDto, executorUserId: string) {
        try {
            if ((!await this._userIsChannelRole(executorUserId, dto.channelUserId, ChannelRol.USER))
                && await this._channelUserIsChannelRole(dto.channelUserId, ChannelRol.USER))
            {
                return await this.muteChannelUser(dto);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async protectedUnMuteChannelUser(executorUserId: string, targetChannelUserId: string) {
        try {
            if ((! await this._userIsChannelRole(executorUserId, targetChannelUserId, ChannelRol.USER))
                && await this._channelUserIsChannelRole(targetChannelUserId, ChannelRol.USER))
            {
                return await this.unMuteChannelUser(targetChannelUserId);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async protectedKickChannelUser(executorUserId: string, targetChannelUserId: string) {
        try {
            if ((!await this._userIsChannelRole(executorUserId, targetChannelUserId, ChannelRol.USER))
                && await this._channelUserIsChannelRole(targetChannelUserId, ChannelRol.USER))
            {
                return await this.kickChannelUser(targetChannelUserId);
            } else {
                throw new ForbiddenException({ response: 'Forbidden'});
            }
        } catch (error) {
            throw (error);
        }
    }

    async setChannelPass(dto: CreateChannelPassDto, executorUserId: string) {
        try {
            const channelUserId : string = await this._getChannelUserIdFromChannelIdAndUserId(executorUserId, dto.channelId);
            if (! await this._channelUserIsChannelRole(channelUserId, ChannelRol.OWNER)) {
                throw new ForbiddenException();
            }
            const hash: string | null =  dto.password ? await argon.hash(dto.password) : null;
            const channel = await this.prisma.channel.update({
                where: { channelId: dto.channelId },
                data: { password: hash }
            });
            return channel;
        } catch (error) {
            throw (error);
        }
    }

    async reOwningChannel(channelId: string) {
        const owner: ChannelUser = await this.prisma.channelUser.findFirst({
            where: {
                channelId: channelId,
                leaveAt: null,
                isOwner: true,
            }
        });
        if (owner === undefined) {
            let newOwner: ChannelUser = await this.prisma.channelUser.findFirst({
                where: {
                    channelId: channelId,
                    leaveAt: null,
                    isAdmin: true,
                },
                orderBy: {
                    joinedAt: 'desc',
                },
            });
            if (newOwner === undefined) {
                newOwner = await this.prisma.channelUser.findFirst({
                    where: {
                        channelId: channelId,
                        leaveAt: null,
                    },
                    orderBy: {
                        joinedAt: 'desc',
                    },
                });
            }
            if (newOwner !== undefined) {
                const newOwnerUpdated = await this.prisma.channelUser.update({
                    where: { channelUserId: newOwner.channelUserId },
                    data: { isOwner: true }
                });
                return newOwner;
            }
        }
    }

}
