import { Channel} from '@prisma/client';
import { Exclude } from 'class-transformer';
 
export class ResponseChannelDto implements Channel {
    channelId: string;
    createdAt: Date;
    createdBy: string;
    channelName: string;
    avatar: string;

    @Exclude()
    password: string;
}
