import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Channel, ChannelUsersExtended, User } from 'src/app/models';
import { BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { DateMutations, UriConstants } from 'src/app/utils';
import { ChannelUsersToAdmin } from '../../channel';


@Component({
  selector: 'app-administration-channel-management-users',
  templateUrl: './administration-channel-management-users.component.html',
  styleUrls: ['./administration-channel-management-users.component.scss']
})
export class AdministrationChannelManagementUsersComponent extends BaseComponent<ChannelUsersToAdmin> implements OnInit, OnChanges {
  @Input() channel!: Channel;
  constructor(
    private readonly api :ApiService<ChannelUsersToAdmin>,
    private readonly cachedUsers: UsersCache,
    private readonly dateMutations: DateMutations
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
    // Fetch channel users or perform any necessary actions
    const channelUsers = (await this.searchArrAsync({
      url: `${UriConstants.ADMIN_MANAGE_CHANNELS}/${newChannel.channelId}/users`,
    })).response;
    // Update the component state with the new channel users
    this.channelUsers.clear();
    for (let u of channelUsers){
      u.user = this.cachedUsers.getUser(u.userId);
      if (u.user !== undefined) {
        u.status = this._getStatus(u);
        this.channelUsers.set(u.channelUserId, u);
      }
    }
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
