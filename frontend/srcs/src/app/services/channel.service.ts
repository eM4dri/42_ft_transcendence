import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MySocket } from './web-socket.service';
import { Channel, ChannelMessage, ChannelMessages, ChannelUsers, JoinChannelDto } from '../models';


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

  joinedChannels() {
    return this.mysocket.fromEvent<Channel[]>('joined_channels').pipe(map((data) => data));
  }


  channelUsersLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelUsers[]>(`${channelId}_users`).pipe(map((data) => data));
  }
  
  channelMessagesLoaded(channelId: string) {
    return this.mysocket.fromEvent<ChannelMessages[]>(`${channelId}_messages`).pipe(map((data) => data));
  }
}
