import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChannelsCache, UsersCache } from 'src/app/cache';
import { Channel, ChannelMessages, ChannelUsers, ChannelUsersExtended, User } from 'src/app/models';
import { ChannelService } from 'src/app/services';
import { DateMutations } from 'src/app/utils';

export interface ChannelUsersData extends ChannelUsers {
  user?: User;
}


@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() channel!: Channel;
  @ViewChild('channelContainer') private channelContainer!: ElementRef;

  channelMessages: Map<number,ChannelMessages[]> = new Map<number,ChannelMessages[]>();
  channelUsers: Map<string,ChannelUsersData> = new Map<string,ChannelUsersData>();
  myChannelUser!: ChannelUsersExtended;

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
    this.cachedChannels.getmyChannelUserSub().subscribe(res=>{
      if (res.channelId === this.channel.channelId) {
        this.myChannelUser = res.myChannelUser;
      }
    })
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
      const  myChannelUser =  this.cachedChannels.getMyChannelUser(this.channel.channelId);
      if (myChannelUser !== undefined)  {
        this.myChannelUser = myChannelUser;
      }
    }

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  constructor(
    private readonly channelService: ChannelService,
    private readonly cachedChannels: ChannelsCache,
    private readonly cachedUsers: UsersCache,
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

  public getInputPlaceHolder() {
    return "Enter message"
  }

  isMuted(): boolean {
    if (this.myChannelUser !== undefined)
    {
      if (this.myChannelUser.mutedUntill !== null){
          if (new Date(this.myChannelUser.mutedUntill).getTime() > Date.now()) {
              return true;
          }
      }
    }
    return false;
  }

  private scrollToBottom(): void {
    try {
      this.channelContainer.nativeElement.scrollTop = this.channelContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
