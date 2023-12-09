import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelsCache, UsersCache } from 'src/app/cache';
import { Channel, ChannelMessages, ChannelUsers, ChannelUsersExtended, User } from 'src/app/models';
import { ChannelService } from 'src/app/services';
import { DateMutations } from 'src/app/utils';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy{
  @Input() channel!: Channel;
  @ViewChild('channelContainer') private channelContainer!: ElementRef;

  channelMessages: Map<number,ChannelMessages[]> = new Map<number,ChannelMessages[]>();
  channelUsers: Map<string,ChannelUsers> = new Map<string,ChannelUsers>();
  blockedChannelUsers: Set<string> = new Set<string>();
  myChannelUser!: ChannelUsersExtended;
  inputValue: string = '';

  private readonly channelService = inject(ChannelService);
  private readonly cachedChannels = inject(ChannelsCache);
  private readonly cachedUsers = inject(UsersCache);
  private readonly dateMutations = inject(DateMutations);

  subscriptions: Subscription[] = [];


  ngOnInit(): void {
    this.subscriptions.push(
      this.cachedChannels.getChannelMessagesSub().subscribe(res=>{
        if (res.channelId === this.channel.channelId) {
          const messages = res.channelMessages;
          for (const m of messages){
            const dayMessages = this.channelMessages.get(m[0]);
            if (dayMessages !== undefined){
              for (const dm of m[1]){   // iter through subscribed messages received
                if (dayMessages.find(x=>x.channelMessageId === dm.channelMessageId) === undefined){ // avoid duplicates checking if I haven't got msg earlier
                  this.channelMessages.set(m[0], dayMessages?.concat(m[1]));
                }
              } 
            } else {
              this.channelMessages.set(m[0], m[1]);
            }
          }
        }
      })
    );
    this.subscriptions.push(
      this.cachedChannels.getChannelUsersSub().subscribe(res=>{
        if (res.channelId === this.channel.channelId) {
          let channelUsers = res.channelUsers;
          for (let c of channelUsers){
            if (this.cachedUsers.isUserBlocked(c.userId)) {
              this.blockedChannelUsers.add(c.channelUserId);
            }
            this.channelUsers.set(c.channelUserId, c);
          }
        }
      })
    );
    this.subscriptions.push(
      this.cachedChannels.getmyChannelUserSub().subscribe(res=>{
        if (res.channelId === this.channel.channelId) {
          this.myChannelUser = res.myChannelUser;
        }
      })
    );
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
      if (this.cachedUsers.isUserBlocked(c.userId)) {
        this.blockedChannelUsers.add(c.channelUserId);
      }
      this.channelUsers.set(c.channelUserId, c);
      const  myChannelUser =  this.cachedChannels.getMyChannelUser(this.channel.channelId);
      if (myChannelUser !== undefined)  {
        this.myChannelUser = myChannelUser;
      }
    }

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

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

  public getUser(channelUserId:string) {
    const user = this.channelUsers.get(channelUserId);
    const userId =  user?.userId || 'unKnown'
    return this.cachedUsers.getUser(userId);
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

