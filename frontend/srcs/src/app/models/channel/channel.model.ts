import { User } from "../user/user.model";

export type Channel = {
    channelId: string,
    channelName: string,
    isLocked: boolean,
    avatar?: string
  }
  
  export type ChannelUsers = {
      userId: string;
      channelUserId: string;
      joinedAt: Date;
      leaveAt: Date;
  }

  export interface ChannelUsersData extends ChannelUsers {
    user?: User;
  }
  
  export type ChannelMessages = {
    channelMessageId: string,
    channelUserId: string,
    createdAt: string,
    updatedAt: string,
    message: string
  }
  
  export type ChannelMessage = {
    channelId: string,
    message: string,
  }
 
  export type JoinChannelDto = {
    channelId: string,
    password?: string,
  }