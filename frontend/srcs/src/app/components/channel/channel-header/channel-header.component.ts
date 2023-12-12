import { Component, Input } from '@angular/core';
import { ChannelsCache } from 'src/app/cache';
import { Channel } from 'src/app/models';
import {  ChatComponent } from 'src/app/modules';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss']
})
export class ChannelHeaderComponent {

  @Input() channel!:Channel;
  constructor(
    private readonly chatComponent: ChatComponent,
    private readonly cachedChannels: ChannelsCache,
    private readonly parent: ChatComponent
  )
  {  }

  getOutOfChannel(){
    this.parent.goBackToNoChannel();
  }

  manageChannel(){
    this.chatComponent.manageChannel(this.channel);
  }


  amIChannelAdmin(channelId: string) : boolean {
    return this.cachedChannels.getMyChannelUser(channelId)?.isAdmin || this.cachedChannels.getMyChannelUser(channelId)?.isOwner ? true : false;
 }

}
