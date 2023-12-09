import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from 'src/app/services';
import { UsersCache, ChannelsCache } from 'src/app/cache';
import { Channel, User } from 'src/app/models';

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
export class AdministrationComponent {

  public ManageOption : string = EnumAdminPanelTypeSelected.NONE;

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
    private readonly userService: UserService,
    private readonly cachedChannels: ChannelsCache,
    private readonly cachedUsers: UsersCache
  ) {
    this.userService.clientReady();
    this.cachedChannels.getresetChannelSub().subscribe((data) => {
      if (this.currentChannel.channelId === data.channelId ){
          this.currentChannel = {
              channelId: 'none',
              channelName: '0',
              avatar: '',
              isLocked: true
          };
      }
  });
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
