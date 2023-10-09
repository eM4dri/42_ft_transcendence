import { Component } from '@angular/core';
import { ApiService, AuthService, Channel, ChannelMessages, ChannelService, ChannelUser, ChannelUsers } from 'src/app/services';
import { SessionStorageConstants, UriConstants } from 'src/app/utils';
import { BaseComponent } from '../shared';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent extends BaseComponent<Channel> {
  counter=0;
  inputValue = '';
  inputValuePass = '';
  itsNewChannel: boolean = false;
  itsNewChannelUserId: string = '';
  itsNewChannelUsername: string = '';
  currentChannel: Channel = {
    channelId: 'none',
    channelName: '0',
    isLocked: true
  };
  private channelsMessages = new Map<string, ChannelMessages[] >();
  private channelsUsers = new Map<string, ChannelUsers[] >();
  currentChannelMessages: any[]= [];
  currentChannelUsers: any[]= [];
  myChannelUserId:string = '';
  private _channelsAvailables = new Map<string, Channel >();
  joinedChannels: Channel[] = [];
  channels: Channel[] = [];
  conectedUsers = new Set<string>();

  constructor(
      protected readonly api: ApiService<Channel>,
      protected readonly channelService: ChannelService,
      private readonly authService: AuthService,
    ) {
      super(api);

      this.channelService.joinedChannels().subscribe(channels => {
          channels.forEach(channel => {
              this._channelsAvailables.set(channel.channelId, channel);
              this.channelService.channelUsersLoaded(channel.channelId).subscribe( users => {
                  this._setChannelUsers(channel.channelId, users);
                });
                this.channelService.channelMessagesLoaded(channel.channelId).subscribe(messages => {
                    this._setChannelMessages(channel.channelId, messages);
              });
          });
          this.joinedChannels = Array.from(this._channelsAvailables.values());
      });
  }

  private _setChannelUsers(channelId: string, users: ChannelUsers[]) {
      let currentChannelUser: ChannelUsers[] = this.channelsUsers.get(channelId) || [];
      if (currentChannelUser?.length) {
          users.forEach(user => {
              if (currentChannelUser.find(x=>x.channelUserId === user.channelUserId) === undefined) {
                currentChannelUser.push(user);
              }
          });
          this.channelsUsers.set(channelId, currentChannelUser);
          if (this.currentChannel.channelId === channelId) {
              this.currentChannelUsers = currentChannelUser;
          }
      } else {
          this.channelsUsers.set(channelId, users);
          this.currentChannelUsers = users;
      }
  }

  private _setChannelMessages(channelId: string, messages: ChannelMessages[]) {
      let currentChannelMsg: ChannelMessages[] = this.channelsMessages.get(channelId) || [];
      if (currentChannelMsg?.length) {
          messages.forEach(msg => {
              if (currentChannelMsg.find(x=>x.channelMessageId === msg.channelMessageId) === undefined) {
                  currentChannelMsg.push(msg);
              }
          });
          this.channelsMessages.set(channelId, currentChannelMsg);
          if (this.currentChannel.channelId === channelId) {
              this.currentChannelMessages = this._transform(currentChannelMsg);
          }
      } else {
          this.channelsMessages.set(channelId, messages);
          this.currentChannelMessages = this._transform(messages);
      }
  }

  public sendMessage() {
    if (this.inputValue) {
        this.channelService.sendMessage({
            channelId: this.currentChannel.channelId,
            message: this.inputValue
        });
        this.inputValue = '';
    }
  }

  public async channelsToJoin() {
    this.channels = (await this.searchArrAsync({
              url: `${UriConstants.CHANNELS}/availables`,
          })).response;
  }

  public joinChannel(channel: Channel){
    if (this.inputValuePass) {
        this.channelService.joinChannel({
            channelId: channel.channelId,
            password: this.inputValuePass,
        });
        this.inputValuePass = '';
    }
    this.channelService.joinChannel({
        channelId: channel.channelId,
        password: this.inputValuePass,
    });
  }

  public loadChannel(channel: Channel) {
    console.log('channel loaded');
    const users = this.channelsUsers.get(channel.channelId);
    if (users !== undefined){
        this.currentChannelUsers = users;
        this.myChannelUserId = users.find(x => x.userId === this.authService.readFromCookie(
                                  SessionStorageConstants.USER_TOKEN,
                              ).sub && x.leaveAt === null)?.channelUserId || '';
    }
    const messages = this.channelsMessages.get(channel.channelId);
    if (messages !== undefined ) {
        this.currentChannelMessages = this._transform(messages);
        const messages2 =  this._transform(messages);
        console.log(messages2, 'messages2');
    }    
    this.currentChannel = channel;
    this._resetNewChannel();
  }

  _resetNewChannel(){
      if (this.itsNewChannel) {
          this.itsNewChannel = false;
          this.itsNewChannelUserId = '';
          this.itsNewChannelUsername = '';
      }
  }

  public toTimeLocale(date: string){
      return new Date(date).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit", hour12: false  });
  }

  private _transform(items: any[]): any[] {
      let groupedItems:any[] = [];

      items.forEach((item) => {
          //parsing to avoid culture problems
        const local = new Date(item.createdAt);
        const fecha = new Date (
              local.getFullYear(), local.getMonth(), local.getDate()
          ).getTime();
        if (!groupedItems[fecha]) {
          groupedItems[fecha] = [];
        }
        groupedItems[fecha].push(item);
      });

      return groupedItems;
  }

  public toDayLocale(time: string):string {
      let options: {} = {};
      const today: number = Date.now();
      const daysTillToday = Math.abs((today - Number(time)) / (1000 * 60 * 60 * 24));
      if (daysTillToday >  7 ) {
          if (new Date(time).getFullYear !== new Date().getFullYear) {
              options = {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              };
          } else {
              options = {
                  day: "numeric",
                  month: "long",
              };
          }
      } else if (daysTillToday > 1 ){
          options = {
              weekday: "long"
          };
      } else if (daysTillToday === 1 ){
          return "ayer";
      } else {
          return "hoy";
      }
      return new Date(Number(time)).toLocaleDateString([navigator.language], options);
  }

  public getUsermane(channelUserId:string) {
    if (channelUserId !== this.myChannelUserId) {
        return this.currentChannelUsers.find(x=>x.channelUserId ===channelUserId)?.username;
    }
    return '';
  }

}
