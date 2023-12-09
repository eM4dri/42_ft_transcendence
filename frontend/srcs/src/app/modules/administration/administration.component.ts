import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';
import { ChannelsCache } from 'src/app/cache';
import { Channel, User } from 'src/app/models';
import { BaseComponent } from '../shared';
import { UriConstants } from 'src/app/utils';

export class EnumAdminPanelTypeSelected {
  public static readonly NONE = "NONE";
  public static readonly MANAGE_CHANNEL = "MANAGE_CHANNEL"
  public static readonly MANAGE_USER = "MANAGE_USER"
}

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent extends BaseComponent<Channel> implements OnInit {

  public ManageOption : string = EnumAdminPanelTypeSelected.NONE;
  channels : Channel [] = [];

  currentUser: User = {
    userId: '',
    username: '',
  }

  currentChannel: Channel = {
    channelId: 'none',
    channelName: '0',
    avatar: '',
    isLocked: true
  };

  constructor(
    private readonly cachedChannels: ChannelsCache,
    private readonly api: ApiService<Channel>,
  ) {
    super(api);
    this.cachedChannels.getresetChannelSub().subscribe();
  }

  async ngOnInit() {
    this.channels =(await this.searchArrAsync({
      url: `${UriConstants.CHANNEL}/all`,
    })).response;
  }

  removeChannel(channelId: string) {
    this.channels = this.channels.filter(
      (x) => x.channelId !== channelId
    )
    this.currentChannel = {
      channelId: 'none',
      channelName: '0',
      avatar: '',
      isLocked: true
    };
    this.ManageOption = EnumAdminPanelTypeSelected.NONE;
  }

  public loadChannel(channel: Channel){
    this.currentChannel = channel;
  }

  selectedTab : string = "users";

  showUsersTab() {
    this.selectedTab = "users";
    this.ManageOption = EnumAdminPanelTypeSelected.NONE;
  }

  showChannelsTab() {
    this.selectedTab = "channels";
    this.ManageOption = EnumAdminPanelTypeSelected.NONE;
  }

  isUsersTabSeleted(){
    return  (this.selectedTab === "users");
  }

  channelClicked(channel: Channel) {
    this.currentChannel = channel;
    this.ManageOption = EnumAdminPanelTypeSelected.MANAGE_CHANNEL;
  }

  userClicked(user : User) {
    this.currentUser = user;
    this.ManageOption = EnumAdminPanelTypeSelected.MANAGE_USER;
  }
}
