import { ChannelUser} from '@prisma/client';
import { Exclude } from 'class-transformer';
 
export class ResponseChannelUserDto implements ChannelUser {
    channelUserId: string;
    userId: string;
    joinedAt: Date;
    leaveAt: Date;
    channelId: string;
    
    username: string;

    @Exclude()
    isAdmin: boolean;
    @Exclude()
    isOwner: boolean;
    @Exclude()
    isBanned: boolean;
    @Exclude()
    mutedUntill: Date;
}

