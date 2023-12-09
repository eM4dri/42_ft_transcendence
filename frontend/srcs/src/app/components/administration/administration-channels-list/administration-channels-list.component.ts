import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Channel } from 'src/app/models';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService, ChannelService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import {AdministrationComponent} from 'src/app/modules/administration/administration.component'

// Juanqueao de channel-sidebar

@Component({
  selector: 'administration-channels-list',
  templateUrl: './administration-channels-list.component.html',
  styleUrls: ['./administration-channels-list.component.scss']
})
export class AdminstrationChannelsComponent extends BaseComponent<Channel> implements OnChanges, OnInit {

  @Input() currentChannel!: Channel;
  @Input() channels : Channel [] = [];
  filteredChannels : Channel [] = [];

  constructor(
    private readonly api: ApiService<Channel>,
    private readonly channelService: ChannelService,
    private readonly adminstrationComponent :AdministrationComponent
  ) {
    super(api);
  }

  async ngOnInit() : Promise<void>{
    this.assignFilteredChannelsToSortedChannels();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.assignFilteredChannelsToSortedChannels();
    this.filterChannels();
  }

  isCurrentChannel(channel: Channel){
    return this.currentChannel.channelId === channel.channelId;
  }

  assignFilteredChannelsToSortedChannels() {
    this.filteredChannels = this.channels.sort(
      (a,b) => a.channelName.localeCompare(b.channelName)
    );
  }

  channelSearchInput: string = '';

  filterChannels() {
    if (this.channelSearchInput) {
      this.filteredChannels = this.channels.filter(item =>
        item.channelName.toLowerCase().includes(this.channelSearchInput.toLowerCase())
      );
      this.filteredChannels = this.filteredChannels.sort(
        (a,b) => a.channelName.localeCompare(b.channelName)
      );
    } else {
      this.assignFilteredChannelsToSortedChannels();
    }
  }

  channelClicked(channel : Channel) {
    this.adminstrationComponent.channelClicked(channel);
  }

}
