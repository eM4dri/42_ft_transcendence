import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelsCache, UsersCache } from 'src/app/cache';
import { Channel, ChannelMessages, ChannelUsers, User } from 'src/app/models';
import { AdministrationComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { DateMutations, UriConstants } from 'src/app/utils';

export interface ChannelUsersExtended  extends ChannelUsers{
  user: User;
}

@Component({
  selector: 'app-administration-channel-window',
  templateUrl: './administration-channel-window.component.html',
  styleUrl: './administration-channel-window.component.scss'
})
export class AdministrationChannelWindowComponent implements OnInit, OnChanges, OnDestroy {
  @Input() channel!: Channel;
  channelUsers:ChannelUsersExtended[] =[];
  channelMessages: Map<number,ChannelMessages[]> = new Map<number,ChannelMessages[]>();
  // myChannelUser!: ChannelUsersExtended;
  subscriptions: Subscription[] = [];

  private readonly cachedChannels = inject(ChannelsCache);
  private readonly cachedUsers = inject(UsersCache);
  private readonly dateMutations = inject(DateMutations);
  private readonly api = inject(ApiService);
  private readonly parent = inject(AdministrationComponent)

  ngOnInit() {
    this._getMessages();
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    this._getMessages();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private _getMessages(){
    this.subscriptions.push(
      this.api.getListService({
        url: `${UriConstants.ADMIN_MANAGE_CHANNELS}/${this.channel.channelId}/messages`,
      }).subscribe({
        next: (res: any) => {
          this.channelMessages = this.dateMutations.toDateMap(res.response.channelMessages);          
          this.channelUsers = res.response.channelUsers;
        },
      })
    );
  }



  public toDayLocale(time: number):string {
    return this.dateMutations.toDayLocale(time);
  }

  public getUser(channelUserId: string) {
    const channelUser = this.channelUsers.find(user => user.channelUserId === channelUserId);
    if (channelUser !== undefined) {
      return channelUser.user;
    }
    return undefined
  }

  public exitChannel(){
    this.parent.exitChannel();
  }

}
