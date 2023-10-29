import { Component, Input, OnInit } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Channel, ChannelUsersData } from 'src/app/models';
import { BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';


interface ChannelUsersAdmin extends ChannelUsersData {
  isOwner: boolean,
  isAdmin: boolean,
  isBanned: boolean,
  mutedUntil: Date,
}

@Component({
  selector: 'app-channel-management-users',
  templateUrl: './channel-management-users.component.html',
  styleUrls: ['./channel-management-users.component.scss']
})
export class ChannelManagementUsersComponent extends BaseComponent<ChannelUsersAdmin> implements OnInit {
  @Input() channel!: Channel;
  constructor(
    private readonly api :ApiService<ChannelUsersAdmin>,
    private readonly cachedUsers: UsersCache
  ){
    super(api);
  }

  
  channelUsers: ChannelUsersAdmin[] = [];

  async ngOnInit(): Promise<void> {
    const channelUsers = (await this.searchArrAsync({
        url: `${UriConstants.MANAGE_CHANNELS}/${this.channel.channelId}/users`,
    })).response;
    for (let u of channelUsers){
      u.user = this.cachedUsers.getUser(u.userId);
      if (u.user !== undefined) {
        this.channelUsers = this.channelUsers.concat([u]);
      }
    }
    console.log('this.channelUsers', channelUsers);
}
}
