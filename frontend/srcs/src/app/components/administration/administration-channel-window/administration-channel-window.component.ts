import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelsCache, UsersCache } from 'src/app/cache';
import { Channel, ChannelMessages, ChannelUsers, ChannelUsersExtended } from 'src/app/models';
import { AdministrationComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { DateMutations, UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-administration-channel-window',
  templateUrl: './administration-channel-window.component.html',
  styleUrl: './administration-channel-window.component.scss'
})
export class AdministrationChannelWindowComponent implements OnInit, OnChanges, OnDestroy {
  @Input() channel!: Channel;
  channelUsers:ChannelUsers[] =[];
  channelMessages: Map<number,ChannelMessages[]> = new Map<number,ChannelMessages[]>();
  myChannelUser!: ChannelUsersExtended;
  subscriptions: Subscription[] = [];

  private readonly cachedChannels = inject(ChannelsCache);
  private readonly cachedUsers = inject(UsersCache);
  private readonly dateMutations = inject(DateMutations);
  private readonly api = inject(ApiService);
  private readonly parent = inject(AdministrationComponent)

  ngOnInit() {  
    this._getMessages();
    this._getUsers();
    this._getMychannelUser();
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    this._getMessages();
    this._getUsers();
    this._getMychannelUser();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private _getMessages(){
    this.subscriptions.push(
      this.api.getListService({
        url: `${UriConstants.CHANNEL}/${this.channel.channelId}/messages`,
      }).subscribe({
        next: (res: any) => {
          this.channelMessages = this.dateMutations.toDateMap(res);
        },
      })
    );
  }

  private _getUsers(){
    this.subscriptions.push(
        this.api.getListService({
          url: `${UriConstants.CHANNEL}/${this.channel.channelId}/users`,
        }).subscribe({
          next: (res: any) => {
            this.channelUsers = res;
          },
        })
    );
  }

  private _getMychannelUser(){
    const  myChannelUser =  this.cachedChannels.getMyChannelUser(this.channel.channelId);
    if (myChannelUser !== undefined)  {
      this.myChannelUser = myChannelUser;
    }
  }

  public toDayLocale(time: number):string {
    return this.dateMutations.toDayLocale(time);
  }

  public getUser(channelUserId: string) {
    const user = this.channelUsers.find(user => user.channelUserId === channelUserId);
    const userId =  user?.userId || 'unKnown'
    return this.cachedUsers.getUser(userId);
  }

  public exitChannel(){
    this.parent.exitChannel();
  }

}
