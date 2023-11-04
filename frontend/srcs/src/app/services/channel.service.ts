import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MySocket } from './web-socket.service';
import { Channel, ChannelMessage, ChannelMessages, ChannelUsers, ChannelUsersExtended, JoinChannelDto } from '../models';


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

  loadChannelSubscriptions(request: string | false) {
    this.mysocket.emit('susbcribe_channel', request);
  }

  sendMessage(msg: ChannelMessage | false) {
    this.mysocket.emit('send_channel_message', msg);
  }

  joinedChannels() {
    return this.mysocket.fromEvent<Channel[]>('joined_channels').pipe(map((data) => data));
  }

  leaveChannel() {
    return this.mysocket.fromEvent<string>('channel_user_leaves').pipe(map((data) => data));
  }

  myChannelUserLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelUsersExtended>(`${channelId}_myuser`).pipe(map((data) => data));
  }

  channelUsersLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelUsers[]>(`${channelId}_users`).pipe(map((data) => data));
  }
  
  channelMessagesLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelMessages[]>(`${channelId}_messages`).pipe(map((data) => data));
  }
}
