import { Component, Input, OnInit } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Channel, ChannelUsersExtended, User } from 'src/app/models';
import { BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { DateMutations, UriConstants } from 'src/app/utils';


export interface ChannelUsersToAdmin extends ChannelUsersExtended {
  user?: User;
  status?: string;
}

@Component({
  selector: 'app-channel-management-users',
  templateUrl: './channel-management-users.component.html',
  styleUrls: ['./channel-management-users.component.scss']
})
export class ChannelManagementUsersComponent extends BaseComponent<ChannelUsersToAdmin> implements OnInit {
  @Input() channel!: Channel;
  constructor(
    private readonly api :ApiService<ChannelUsersToAdmin>,
    private readonly cachedUsers: UsersCache,
    private readonly dateMutations: DateMutations
  ){
    super(api);
  }
  
  channelUsers: Map<string,ChannelUsersToAdmin> = new Map<string,ChannelUsersToAdmin>();
  checked: boolean = true;
  sidebarVisible: boolean = false;

  async ngOnInit(): Promise<void> {
    const channelUsers = (await this.searchArrAsync({
        url: `${UriConstants.MANAGE_CHANNELS}/${this.channel.channelId}/users`,
    })).response;
    for (let u of channelUsers){
      u.user = this.cachedUsers.getUser(u.userId);
      if (u.user !== undefined) {
        u.status = this._getStatus(u);
        this.channelUsers.set(u.channelUserId, u);
      }
    }
    console.log('this.channelUsers', channelUsers);
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
