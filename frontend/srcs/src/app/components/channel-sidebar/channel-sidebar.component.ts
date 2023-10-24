import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Channel } from 'src/app/models';
// import { ChannelComponent } from 'src/app/modules/channel/channel.component';
import { ChatComponent } from 'src/app/modules/chat/chat.component';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService, ChannelService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-channel-sidebar',
  templateUrl: './channel-sidebar.component.html',
  styleUrls: ['./channel-sidebar.component.scss']
})
export class ChannelSidebarComponent extends BaseComponent<Channel> implements OnChanges {
  @Input() joinedChannels!: Map< string, Channel >;
  constructor( 
    private readonly api: ApiService<Channel>,
    private readonly chatComponent: ChatComponent,
    private readonly channelService: ChannelService
  ) {
    super(api);
    this.filteredChannels = this.channels;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredChannels = this.channels;
  }
  searchChannel: string = '';
  channels : Channel [] = [];
  filteredChannels : Channel [] = [];

  joinChannel(channel: Channel) {
    this.channelService.joinChannel({
      channelId: channel.channelId
    });
    this.filteredChannels = [];
    //   this.channelService.joinChannel({
    //       channelId: channel.channelId,
    //       password: this.inputValuePass,
    //   });
  }

  public async channelsToJoin() {
    this.channels =(await this.searchArrAsync({
      url: `${UriConstants.CHANNELS}/availables`,
          })).response.filter(x=>x).map(channel=>{
            return {
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${channel.channelName}`,
              channelId: channel.channelId,
              channelName: channel.channelName,
              isLocked: channel.isLocked
            };
          });
    this.filteredChannels = this.channels;
  }

  loadChannel(channel: Channel) {
    this.chatComponent.loadChannel(channel);
  }

  filterChannels() {
    if (this.searchChannel) {
      this.filteredChannels = this.channels.filter(item =>
        item.channelName.toLowerCase().includes(this.searchChannel.toLowerCase())
      );
    } else {
      this.filteredChannels = this.channels;
    }
  }

  isCurrentChannel(channel: Channel){
    return this.chatComponent.currentChannel.channelId === channel.channelId;
  }
}
