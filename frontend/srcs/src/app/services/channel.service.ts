import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MySocket } from './web-socket.service';

export type Channel = {
  channelId: string,
  channelName: string,
  isLocked: true
}

export type ChannelUsers = {
    userId: string;
    channelUserId: string;
    username: string;
    joinedAt: Date;
    leaveAt: Date;
}

export type ChannelMessages = {
  channelMessageId: string,
  channelUserId: string,
  // username: string,
  createdAt: string,
  updatedAt: string,
  message: string
}

export type ChannelMessage = {
  channelId: string,
  message: string,
}

export type ChannelUser = {
  userId: string,
  username: string,
}

export type JoinChannelDto = {
  channelId: string,
  password?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  sendTyping(msg: string | false) {
    this.mysocket.emit('typing', msg);
  }

  joinChannel(request: JoinChannelDto | false) {
    this.mysocket.emit('join_channel', request);
  }

  sendMessage(msg: ChannelMessage | false) {
    this.mysocket.emit('send_channel_message', msg);
  }

  userListening() {
    return this.mysocket.fromEvent<string>('listening').pipe(map((data) => data));
  }

  usersConnected() {
    return this.mysocket.fromEvent<string[]>('users_connected').pipe(map((data) => data));
  }

  userDisconnects() {
    return this.mysocket.fromEvent<string>('user_disconnects').pipe(map((data) => data));
  }

  userConnects() {
    return this.mysocket.fromEvent<string>('user_connects').pipe(map((data) => data));
  }

  joinedChannels() {
    return this.mysocket.fromEvent<Channel[]>('joined_channels').pipe(map((data) => data));
  }

  newChannelAvailable() {
    return this.mysocket.fromEvent<Channel>('new_channel_available').pipe(map((data) => data));
  }

  channelUsersLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelUsers[]>(`${channelId}_users`).pipe(map((data) => data));
  }
  
  channelMessagesLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelMessages[]>(`${channelId}_messages`).pipe(map((data) => data));
  }
}
