import { Component, Input, OnChanges, SimpleChanges, TemplateRef, inject } from '@angular/core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Channel } from 'src/app/models';
import { ChatComponent } from 'src/app/modules/chat/chat.component';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { ChannelsCache } from 'src/app/cache';

@Component({
  selector: 'app-channel-sidebar',
  templateUrl: './channel-sidebar.component.html',
  styleUrls: ['./channel-sidebar.component.scss']
})
export class ChannelSidebarComponent extends BaseComponent<Channel, {}> implements OnChanges {
  @Input() joinedChannels!: Map< string, Channel >;

  constructor(
    private readonly api: ApiService<Channel, {}>,
    private readonly chatComponent: ChatComponent,
    private readonly modalService: NgbModal,
    private readonly channelsCache: ChannelsCache
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
  resetChannel: Channel = {
    channelId: '',
    channelName: '',
    isLocked: false,
  };
  channelToJoin: Channel = this.resetChannel;
  passwordToJoin: string = '';
  modalReference: NgbModalRef[] = [];

  joinChannel(channel: Channel) {
    this.createService({
        url: `${UriConstants.CHANNEL}/join`,
        data: { channelId: channel.channelId }
      }).subscribe({
        error: error => {
          this.alertConfiguration('ERROR', error);
          this.openAlert();
          this.loading = false;
        },
      });
    this.passwordToJoin = '';
    this.channelToJoin = this.resetChannel;
    this.filteredChannels = [];
  }

  public async channelsToJoin() {
    this.channels =(await this.searchArrAsync({
      url: `${UriConstants.CHANNEL}/availables`,
          })).response;
    this.passwordToJoin = '';
    this.channelToJoin = this.resetChannel;
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


	open(content: TemplateRef<any>, channel: Channel) {
    this.channelToJoin = channel;
		this.modalReference.push(this.modalService.open(content));
	}

  joinChannelWithPass() {
    this.createService({
        url: `${UriConstants.CHANNEL}/join`,
        data: { channelId: this.channelToJoin.channelId, password: this.passwordToJoin }
      }).subscribe({
        error: error => {
          this.alertConfiguration('ERROR', error);
          this.openAlert();
          this.loading = false;
        },
      });
    this.passwordToJoin = '';
    this.channelToJoin = this.resetChannel;
    this.filteredChannels = [];
    for (const modal of this.modalReference){
      modal.close();
    }
    this.modalReference = [];
  }

  amIChannelAdmin(channelId: string) : boolean {
    return this.channelsCache.getMyChannelUser(channelId)?.isAdmin || this.channelsCache.getMyChannelUser(channelId)?.isOwner ? true : false;
 }


  newChannel() {
    this.chatComponent.manageChannel();
  }

  manageChannel(channel: Channel) {
    this.chatComponent.manageChannel(channel);
  }

}
