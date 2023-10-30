import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {  MuteChannelUserDto, CreateChannelPassDto } from '../dto';
import { ChannelUser } from '@prisma/client';
import * as argon from 'argon2';

export enum ChannelRol {
    USER,
    ADMIN,
    OWNER,
}

@Injectable()
export class ChannelAdminService {
    constructor(
        private prisma: PrismaService
    ){
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


    async demoteChannelUser(channelUserId: string, channelAdmin: string) {
        try {
            //! Web owners & moderators can demote ann promote users
            if (await this._havePermisionRightsOverChannelUser(channelAdmin, channelUserId) !== ChannelRol.OWNER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isAdmin: false }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async promoteChannelUser(channelUserId: string, channelAdmin: string) {
        try {
             //! Web owners & moderators can demote ann promote users
            if (await this._havePermisionRightsOverChannelUser(channelAdmin, channelUserId) !== ChannelRol.OWNER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isAdmin: true }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async banChannelUser(channelUserId: string, channelAdmin: string) {
        try {
            if (await this._havePermisionRightsOverChannelUser(channelAdmin, channelUserId) === ChannelRol.USER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isBanned: true }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async unBanChannelUser(channelUserId: string, channelAdmin: string) {
        try {
            if (await this._havePermisionRightsOverChannelUser(channelAdmin, channelUserId) === ChannelRol.USER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { isBanned: false }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async muteChannelUser(dto: MuteChannelUserDto, channelAdmin: string) {
        try {
            if (await this._havePermisionRightsOverChannelUser(channelAdmin,  dto.channelUserId) === ChannelRol.USER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: dto.channelUserId, },
                data: { mutedUntill: dto.mutedUntill }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async unMuteChannelUser(channelUserId: string, channelAdmin: string) {
        try {
            if (await this._havePermisionRightsOverChannelUser(channelAdmin, channelUserId) === ChannelRol.USER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { mutedUntill: null }
            });
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async kickChannelUser(channelUserId: string, channelAdmin: string) {
        try {
            if (await this._havePermisionRightsOverChannelUser(channelAdmin, channelUserId) === ChannelRol.USER) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.update({
                            where: { channelUserId: channelUserId, },
                            data: { leaveAt: new Date( Date.now() ) }
                        });
                        this.reOwningChannel(channelUser.channelId);
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }

    async setChannelPass(dto: CreateChannelPassDto, channelOwner: string){
        try {
            if (await this._isChannelOwner(channelOwner, dto.channelId) === ChannelRol.USER) {
                throw new UnauthorizedException();
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

    private async _havePermisionRightsOverChannelUser(userId: string, channelUserId: string) {        
        const channelUser: ChannelUser = (await this.prisma.channelUser.findUniqueOrThrow({
            where: { channelUserId: channelUserId, }
        }));
        const possibleAdmin: ChannelUser = await this.prisma.channelUser.findFirstOrThrow({
            where: {
                channelId: channelUser.channelId,
                userId: userId,
                leaveAt: null
            }
        });
        // It's a made up role because ADMINS can do one thing and OWNERS these thing and one more but depens on being in a superior hierarchy
        // let's say that is the role of the issuer(posible admin) compared with the receptor 
        if ( !channelUser.isOwner && possibleAdmin.isOwner ){
            return ChannelRol.OWNER;
        } else if ( !channelUser.isOwner && !channelUser.isAdmin && ( possibleAdmin.isAdmin || possibleAdmin.isOwner )){
            return ChannelRol.ADMIN;
        } else {
            return ChannelRol.USER
        }
    }

    private async _isChannelOwner(userId: string, channelId: string) {
        const possibleAdmin: ChannelUser = await this.prisma.channelUser.findFirstOrThrow({
            where: {
                channelId: channelId,
                userId: userId,
                leaveAt: null
            }
        });
        if ( possibleAdmin.isOwner ){
            return ChannelRol.OWNER;
        } else {
            return ChannelRol.USER
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
