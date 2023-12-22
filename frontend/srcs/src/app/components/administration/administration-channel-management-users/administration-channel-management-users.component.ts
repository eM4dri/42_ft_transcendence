import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Channel, ChannelUsersExtended, User } from 'src/app/models';
import { AdministrationComponent, BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { DateMutations, UriConstants } from 'src/app/utils';
import { ChannelUsersToAdmin } from '../../channel';
import { AdminstrationChannelsComponent } from '../administration-channels-list/administration-channels-list.component';


@Component({
  selector: 'app-administration-channel-management-users',
  templateUrl: './administration-channel-management-users.component.html',
  styleUrls: ['./administration-channel-management-users.component.scss'],
})
export class AdministrationChannelManagementUsersComponent extends BaseComponent<ChannelUsersToAdmin, {}, {}, {}, Channel> implements OnInit, OnChanges {
  @Input() channel!: Channel;
  constructor(
    private readonly api :ApiService<ChannelUsersToAdmin, {}, {}, {}, Channel>,
    private readonly cachedUsers: UsersCache,
    private readonly dateMutations: DateMutations,
    private parent: AdministrationComponent
  ){
    super(api);
  }

  showButtonsState: { [userId: string]: boolean } = {};

  setShowButtons(user: User, value : boolean) {
    this.showButtonsState[user.userId] = value;
  }

  isShowButtons(user: User) {
      return this.showButtonsState[user.userId];
  }

  channelUsers: Map<string,ChannelUsersToAdmin> = new Map<string,ChannelUsersToAdmin>();
  checked: boolean = true;
  sidebarVisible: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.updateComponentForNewChannel(this.channel);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('channel' in changes) {
      // Channel has changed, update the component
      await this.updateComponentForNewChannel(changes['channel'].currentValue);
    }
  }

  private async updateComponentForNewChannel(newChannel: Channel): Promise<void> {
    // Update the component state with the new channel users
    // Fetch channel users or perform any necessary actions
    const channelUsers = (await this.searchArrAsync({
      url: `${UriConstants.ADMIN_MANAGE_CHANNELS}/${newChannel.channelId}/users`,
    })).response;
    this.channelUsers.clear();
    for (let u of channelUsers){
      u.user = this.cachedUsers.getUser(u.userId);
      if (u.user !== undefined) {
        u.status = this._getStatus(u);
        this.channelUsers.set(u.channelUserId, u);
      }
    }
  }

  async deleteChannel() {
    const dto = {
      channelId: this.channel.channelId
    }
    await this.apiService.deleteService({
      url: `${UriConstants.ADMIN_MANAGE_CHANNELS}/${this.channel.channelId}`,
      data: dto
    }).subscribe({
      next: (res) => {
          this.parent.removeChannel(this.channel.channelId);
      },
      error: error => {
          this.processError(error);
      },
    });
  }

  private _getStatus(user: ChannelUsersToAdmin) {
    let result: string = 'USER';
    if (user.isOwner) {
      result = 'OWNER';
    } else if (user.isAdmin) {
      result = 'ADMIN';
    } else if (user.isBanned) {
      result = 'BANNED';
    } else if (this.isMuted(user)) {
      result = 'MUTED'
    }
    return result;
  }

  getSeverity(user: ChannelUsersToAdmin) {
    let result: string = 'info';
    if (user.isAdmin) {
      result = 'success';
    } else if (user.isBanned)  {
      result = 'danger';
    } else if (this.isMuted(user)) {
      result = 'warning'
    }
    return result;
  }

  processError(error: any){
    this.alertConfiguration('ERROR', error);
    this.openAlert();
    this.loading = true;
  }

  updateChannelUser(channelUser: ChannelUsersToAdmin){
    let user = this.channelUsers.get(channelUser.channelUserId);
    channelUser.user = user?.user;
    channelUser.status = this._getStatus(channelUser);
    this.channelUsers.set(channelUser.channelUserId, channelUser);
  }

  isMuted(channelUser: ChannelUsersToAdmin): boolean {
    if (channelUser.mutedUntill !== null){
        if (new Date(channelUser.mutedUntill).getTime() > Date.now()) {
            return true;
        }
    }
    return false;
  }

  getTimeMuted(channelUser: ChannelUsersToAdmin): string{
     return this.dateMutations.timeLeft(channelUser.mutedUntill);
  }

}
