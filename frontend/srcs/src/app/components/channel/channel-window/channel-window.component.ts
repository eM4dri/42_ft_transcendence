import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChannelsCache, UsersCache } from 'src/app/cache';
import { Channel, ChannelMessages, ChannelUsersData } from 'src/app/models';
import { AuthService, ChannelService } from 'src/app/services';
import { DateMutations, SessionStorageConstants } from 'src/app/utils';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent implements OnInit, OnChanges {
  @Input() channel!: Channel;
  channelMessages: Map<number,ChannelMessages[]> = new Map<number,ChannelMessages[]>();
  channelUsers: Map<string,ChannelUsersData> = new Map<string,ChannelUsersData>();
  myChannelUserId: string = '';

  ngOnInit(): void {
    this.cachedChannels.getChannelMessagesSub().subscribe(res=>{
      if (res.channelId === this.channel.channelId) {
        let messages = res.channelMessages;
        for (let m of messages){
          let dayMessages = this.channelMessages.get(m[0]);
          if (dayMessages !== undefined){
            this.channelMessages.set(m[0], dayMessages?.concat(m[1]));
          } else {
            this.channelMessages.set(m[0], m[1]);
          }
        }
      }
    });
    this.cachedChannels.getChannelUsersSub().subscribe(res=>{
      if (res.channelId === this.channel.channelId) {
        let channelUsers = res.channelUsers;
        for (let c of channelUsers){
          const user = this.cachedUsers.getUser(c.userId);
          const channelUsersData: ChannelUsersData = {
            channelUserId: c.channelUserId,
            leaveAt: c.leaveAt,
            userId: c.userId,
            joinedAt: c.joinedAt,
            user: user
          };
          this.channelUsers.set(c.channelUserId, channelUsersData);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let messages = this.cachedChannels.getChannelMessages(this.channel.channelId);
    let channelUsers = this.cachedChannels.getChannelUsers(this.channel.channelId);
    this.channelMessages.clear();
    for(let m of messages) {
      this.channelMessages.set(m[0], m[1]);
    }
    this.channelUsers.clear();
    for (let c of channelUsers) {
      const user = this.cachedUsers.getUser(c.userId);
      const channelUsersData: ChannelUsersData = {
        channelUserId: c.channelUserId,
        leaveAt: c.leaveAt,
        userId: c.userId,
        joinedAt: c.joinedAt,
        user: user
      };
      this.channelUsers.set(c.channelUserId, channelUsersData);
    }
    this.myChannelUserId = channelUsers.find(x => x.userId === this.authService.readFromCookie(
        SessionStorageConstants.USER_TOKEN,
    ).sub && x.leaveAt === null)?.channelUserId || '';
  }

  constructor(
    private readonly channelService: ChannelService,
    private readonly cachedChannels: ChannelsCache,
    private readonly cachedUsers: UsersCache,
    private readonly authService: AuthService,
    private readonly dateMutations: DateMutations
    ) {  

     }

  counter=0;
  inputValue: string = ''; 

  public toDayLocale(time: number):string {
    return this.dateMutations.toDayLocale(time);
  }

  public sendMessage() {
    if (this.inputValue) {
        this.channelService.sendMessage({
            channelId: this.channel.channelId,
            message: this.inputValue
        });
        this.inputValue = '';
    }
  }

  public getChannelUser(channelUserId:string): ChannelUsersData {
      return this.channelUsers.get(channelUserId) || {
              userId: '',
              channelUserId: '',
              joinedAt: new Date(),
              leaveAt: new Date(),
        };
  }
}
