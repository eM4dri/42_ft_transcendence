import { Component, Input } from '@angular/core';
import { ChannelsCache } from 'src/app/cache';
import { Channel } from 'src/app/models';
import { BaseComponent, ChatComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss']
})
export class ChannelHeaderComponent extends BaseComponent {

  @Input() channel!:Channel;
  constructor(
    private readonly api: ApiService,
    private readonly chatComponent: ChatComponent,
    private readonly cachedChannels: ChannelsCache,
    private readonly parent: ChatComponent
  )
  {
    super(api);
   }

  getOutOfChannel(){
    this.parent.goBackToNoChannel();
  }

  manageChannel(){
    this.chatComponent.manageChannel(this.channel);
  }

  leaveChannel() {
    const channelUserId: string = this.cachedChannels.getMyChannelUser(this.channel.channelId)!.channelUserId;
    this.patch({ url: `${UriConstants.CHANNEL}/leave/${channelUserId}`});
  }

  amIChannelAdmin(channelId: string) : boolean {
    return this.cachedChannels.getMyChannelUser(channelId)?.isAdmin || this.cachedChannels.getMyChannelUser(channelId)?.isOwner ? true : false;
 }

}
