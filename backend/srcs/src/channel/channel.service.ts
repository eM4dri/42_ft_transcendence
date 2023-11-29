import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, CreateChannelMessageDto, JoinChannelDto, ResponseChannelDto, ResponseChannelUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { ChannelAdminService } from './admin/channel.admin.service';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AvatarConstants } from 'src/utils/avatar.contants';

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2,
        private channelAdminService: ChannelAdminService
    ){
    }

    //! Just for website owner &  website moderators 
    getAllChannels(){
        return this.prisma.channel.findMany();
    }

    async getChannelByChannelId(channelId: string){
        return plainToInstance(ResponseChannelDto, await this.prisma.channel.findFirst({
            where: { channelId: channelId }
        }));
    }

    async getChannelsUsersIds(channelsId: string[]){
        return this.prisma.channelUser.findMany({
            where: {
                channelId : { in: channelsId },
            },
        });
    }
    
    async getChannelsJoinedByUserId(userId: string){
        const joinedChannels: string[] = (await this.prisma.channelUser.findMany({
            select: { channelId: true, },
            where: { 
                AND: {
                    userId: userId,
                    leaveAt: null,
                    NOT: { isBanned: true } },
                }
        })).map(x=>x.channelId); 
        return plainToInstance(ResponseChannelDto, await this.prisma.channel.findMany({
            where: {
                channelId: { in: joinedChannels }
            }
        }));
    }

    async getChannelsAvailablesByUserId(userId: string){
        const joinedChannels: string[] = (await this.prisma.channelUser.findMany({
            select: { channelId: true, },
            where: { 
                AND: {
                    userId: userId,
                    leaveAt: null,
                    NOT: { isBanned: true } },
                }
        })).map(x=>x.channelId);
        const bannedChannels: string[] = (await this.prisma.channelUser.findMany({
            select: { channelId: true, },
            where: { 
                AND: {
                    userId: userId,
                    isBanned: true,
                }
            }
        })).map(x=>x.channelId);
        const notAvailableChannelsIds : string[] = joinedChannels.concat(bannedChannels);
        const AvailableChannels = await this.prisma.channel.findMany({
            where: {
                channelId: { notIn: notAvailableChannelsIds }
            }
        });
        const result = AvailableChannels.map((channel) => {
            return {
                channelId: channel.channelId,
                channelName: channel.channelName,
                isLocked: channel.password !== null,
                avatar: channel.avatar
            };
        });
        return result;
    }

    async newChannel(creator: string, dto: CreateChannelDto) {
        try {
            const channel = await this.prisma.channel.create({
                data: {
                  channelName: dto.channelName,
                  createdBy: creator,
                  avatar: `${AvatarConstants.CHANNEL}${dto.channelName}`
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
                this.channelAdminService.setChannelPass({ 
                    channelId: channel.channelId, 
                    password: dto.password 
                }, creator);
            }
            return plainToInstance(ResponseChannelDto, channel);
        } catch (error) {
            if (
                error instanceof
                PrismaClientKnownRequestError
              ) {
                if (error.code === 'P2002') {
                  throw new HttpException(
                    { response:'Channel already in use' },
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
                throw new NotFoundException({response:  'Not Found'});
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
            if (channel.password !== null)  {
                const pwMatches = await argon.verify( channel.password, dto.password);
                if (pwMatches === false) {
                    throw new ForbiddenException({response:"Password doesn't match"});
                }
            }
            const oldChannelUser = (await this.prisma.channelUser.findFirst({
                where: {
                    channelId: dto.channelId,
                    userId: userId,
                    NOT: { leaveAt: null },
                },
            }));
            let channelUser;
            if (oldChannelUser !== null){
                channelUser = await this.prisma.channelUser.update({
                    where: { channelUserId: oldChannelUser.channelUserId, },
                    data: { leaveAt: null },
                });
            } else {
                channelUser = await this.prisma.channelUser.create({
                    data: {
                        channelId: dto.channelId,
                        userId: userId
                    },
                });
             }
            this.channelAdminService.reOwningChannel(channelUser.channelId);           
            return plainToInstance(ResponseChannelUserDto , channelUser);
        } catch (error) {
            if (
                error instanceof
                PrismaClientKnownRequestError
              ) {
                if (error.code === 'P2002') {
                  throw new HttpException(
                    { response:'User already join' },
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
            this.channelAdminService.reOwningChannel(channelUser.channelId);
            this.eventEmitter.emit('channel_user_leaves', channelUser);
            return channelUser;
        } catch (error) {
            throw (error);
        }
    }
    
    async getChannelUsers(channelId: string) {
        try {
            const channelUsers = await this.prisma.channelUser.findMany({
                where: { channelId: channelId }
            });
            return plainToInstance(ResponseChannelUserDto, channelUsers);
        } catch (error) {
            throw (error);
        }
    }

    async getMyChannelUser(channelId: string, userId: string) {
        try {
            return await this.prisma.channelUser.findFirstOrThrow({
                where: { 
                    channelId: channelId,
                    userId: userId,
                    leaveAt: null
                 }
            });
        } catch (error) {
            throw (error);
        }
    }

    async getChannelMessages(channelId: string) {
        try {
            const channelUsersIds: string[] = (await this.prisma.channelUser.findMany({
                where: { channelId: channelId }
            })).map(x=>x.channelUserId);
            const channelMessages = await this.prisma.channelUserMessage.findMany({
                where:{ channelUserId: { in: channelUsersIds } }
            });
            return channelMessages;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException({response:  'Not Found'});
            }
            throw (error);
        }
    }

    async newChannelMessage(talker: string, dto: CreateChannelMessageDto) {
        try {
            const channelUserId = await this.prisma.channelUser.findFirstOrThrow({
                where:{
                    channelId: dto.channelId,
                    userId: talker,
                    leaveAt: null
                }
            });
            const message = await this.prisma.channelUserMessage.create({
                data: {
                    channelUserId: channelUserId.channelUserId,
                    message: dto.message
                }
            });
            return message;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException({response:  'Not Found'});
            }
            throw (error);
        }
    }

}
