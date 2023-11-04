

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

  export interface ChannelUsersExtended extends ChannelUsers {
    isOwner: boolean,
    isAdmin: boolean,
    isBanned: boolean,
    mutedUntill: Date,
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