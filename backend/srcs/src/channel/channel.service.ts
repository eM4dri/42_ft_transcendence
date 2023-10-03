import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, MuteChannelUserDto, CreateChannelPassDto, JoinChannelDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChannelUser } from '@prisma/client';
import * as argon from 'argon2';

export enum ChannelRol {
    USER,
    ADMIN,
    OWNER,
}

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService
    ){
    }

    //! Just for website owner &  website moderators 
    getAllChannels(){
        return this.prisma.channel.findMany();
    }

    async getChannelsByUserId(userId: string){
        const availableChannels: string[] = (await this.prisma.channelUser.findMany({
            select: { channelId: true, },
            where: { NOT: { isBanned: true } }
        })).map(x=>x.channelId);
        return await this.prisma.channel.findMany({
            where: {
                channelId: { in: availableChannels }
            }
        });
    }

    async newChannel(creator: string, dto: CreateChannelDto) {
        try {
            const channel = await this.prisma.channel.create({
                data: {
                  channelName: dto.channelName,
                  createdBy: creator,
                },
            });
            const channelUser = await this.prisma.channelUser.create({
                data: {
                    channelId: channel.channelId,
                    userId: creator,
                    isOwner: true,
                    isAdmin: true
                },
            });
            if (dto.password!==undefined) {
                this.setChannelPass({ 
                    channelId: channel.channelId, 
                    password: dto.password 
                }, creator);
            }
            return {  
                channel:channel,
                channelUser:channelUser,
            };
        } catch (error) {
            if (
                error instanceof
                PrismaClientKnownRequestError
              ) {
                if (error.code === 'P2002') {
                  throw new HttpException(
                    'User already in use',
                    HttpStatus.CONFLICT,
                  );
                }
            }
            throw (error);
        }
    }

    //! Just for website owner &  website moderators 
    async destroyChannel(channelId: string) {
        try {
            const message =
              await this.prisma.channel.delete({
                where: { channelId },
              });
            return message;
          } catch (error) {
            if (
              error instanceof
              PrismaClientKnownRequestError
            ) {
              if (error.code === 'P2025') {
                throw new HttpException(
                  'An operation failed because it depends on one or more records that were required but not found. {cause}',
                  HttpStatus.NOT_FOUND,
                );
              }
            }
            throw error;
          }
    }

    async joinChannel(userId: string, dto: JoinChannelDto) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: { channelId: dto.channelId }
            });
            const pwMatches = await argon.verify( channel.password, dto.password);
            if (pwMatches === false) {
                throw new UnauthorizedException();
            }
            const channelUser = await this.prisma.channelUser.create({
                data: {
                    channelId: dto.channelId,
                    userId: userId
                },
            });
            this._reOwningChannel(channelUser.channelId);
            return channelUser;
        } catch (error) {
            if (
                error instanceof
                PrismaClientKnownRequestError
              ) {
                if (error.code === 'P2002') {
                  throw new HttpException(
                    'User already in use',
                    HttpStatus.CONFLICT,
                  );
                }
            }
            throw (error);
        }
    }

    async leaveChannel(channelUserId: string) {
        try {
            const channelUser = await this.prisma.channelUser.update({
                where: { channelUserId: channelUserId, },
                data: { leaveAt: new Date( Date.now() ) }
            });
            this._reOwningChannel(channelUser.channelId);
            return channelUser;
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
            this.leaveChannel(channelUserId);
        } catch (error) {
            throw (error);
        }
    }

    async setChannelPass(dto: CreateChannelPassDto, channelOwner: string){
        try {
            if (await this._isChannelOwner(channelOwner, dto.channelId) === ChannelRol.USER) {
                throw new UnauthorizedException();
            }
            const hash = await argon.hash(dto.password);
            //! encrypt password
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
        if ( !channelUser.isOwner && !channelUser.isAdmin && ( possibleAdmin.isAdmin || possibleAdmin.isOwner )){
            return ChannelRol.ADMIN;
        } else if ( !channelUser.isOwner && possibleAdmin.isOwner ){
            return ChannelRol.OWNER;
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

    private async _reOwningChannel(channelId: string) {
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
