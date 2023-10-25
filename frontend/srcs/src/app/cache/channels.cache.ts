import { Injectable } from '@angular/core';
import { Channel, ChannelMessages, ChannelUsers } from '../models';
import { Subject } from 'rxjs';
import { ChannelService } from '../services';

interface MyCreatedAtObject {
  createdAt: string;
  // Otras propiedades que pueda tener su objeto
}
@Injectable({
  providedIn: 'root'
})
export class ChannelsCache {
  private _joinedChannelsMap = new Map<string, Channel>();
  private _channelsMessages = new Map<string, ChannelMessages[]>();
  private _channelsUsers = new Map<string, ChannelUsers[]>();

  constructor(
    private readonly channelService: ChannelService,
  ){
    this.channelService.joinedChannels().subscribe(channels => {
      channels.forEach(channel => {
          channel.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${channel.channelName}`;  
          this._joinedChannelsMap.set(channel.channelId, channel);
          this.channelService.channelUsersLoaded(channel.channelId).subscribe( users => {
              this._setChannelUsers(channel.channelId, users);
            });
            this.channelService.channelMessagesLoaded(channel.channelId).subscribe(messages => {
                this._setChannelMessages(channel.channelId, messages);
          });
      });
    });
  }

  private _setChannelUsers(channelId: string, users: ChannelUsers[]) {
    let currentChannelUser: ChannelUsers[] = this._channelsUsers.get(channelId) || [];
    if (currentChannelUser?.length) {
        users.forEach(user => {
            if (currentChannelUser.find(x=>x.channelUserId === user.channelUserId) === undefined) {
              currentChannelUser.push(user);
            }
        });
        this._channelsUsers.set(channelId, currentChannelUser);
    } else {
        this._channelsUsers.set(channelId, users);
    }
    this.updateChannelUsersSub(channelId, users);
  }

  private _setChannelMessages(channelId: string, messages: ChannelMessages[]) {
    let currentChannelMsg: ChannelMessages[] = this._channelsMessages.get(channelId) || [];
    if (currentChannelMsg?.length) {
        messages.forEach(msg => {
            if (currentChannelMsg.find(x=>x.channelMessageId === msg.channelMessageId) === undefined) {
                currentChannelMsg.push(msg);
            }
        });
        this._channelsMessages.set(channelId, currentChannelMsg);
    } else {
        this._channelsMessages.set(channelId, messages);
    }
    this.updateChannelMessagesSub(channelId, this._toDateMap(messages));
  }

  getJoinedChannels():Map< string, Channel >{
    return this._joinedChannelsMap
  }

  getChannelsMessages(){
    return this._channelsMessages;
  }

  getChannelsUsers(){
    return this._channelsUsers;
  }

  getChannelMessages(channelId:string){
    const messages = this._channelsMessages.get(channelId);
    if ( messages !== undefined ) {
      return this._toDateMap(messages);
    }
    return [];
  }

  getChannelUsers(channelId:string){
    const users = this._channelsUsers.get(channelId);
    if ( users !== undefined ) {
      return users;
    }
    return [];
  }

  private joinedChannelsSub = new Subject<Map< string, Channel >>();
  sendJoinedChannelsSub(data: Map< string, Channel >) {
    this.joinedChannelsSub.next(data);
  }
  getJoinedChannelsSub() {
    return this.joinedChannelsSub.asObservable();
  }  
  updateJoinedChannelsSub() {
    this.sendJoinedChannelsSub(this._joinedChannelsMap);
  }
  
  private channelUsersSub = new Subject< {channelId:string, channelUsers:ChannelUsers[]} >();
  sendChannelUsersSub(channelId:string, channelUsers: ChannelUsers[]) {
      this.channelUsersSub.next({channelId, channelUsers});
  }
  getChannelUsersSub() {
    return this.channelUsersSub.asObservable();
  }  
  async updateChannelUsersSub(channelId:string, channelUsers: ChannelUsers[]) {
    this.sendChannelUsersSub(channelId, channelUsers);
  }

  private channelMessagesSub = new Subject< {channelId:string, channelMessages:Map<number, ChannelMessages[]>} >();
  sendChannelMessagesSub(channelId:string, channelMessages:Map<number, ChannelMessages[]>) {
      this.channelMessagesSub.next({channelId, channelMessages});
  }
  getChannelMessagesSub() {
    return this.channelMessagesSub.asObservable();
  }  
  async updateChannelMessagesSub(channelId:string, channelMessages: Map<number, ChannelMessages[]>) {
    this.sendChannelMessagesSub(channelId, channelMessages);
  }

  private _toDateMap<T extends MyCreatedAtObject>(items: T[]): Map<number,T[]> {
    let groupedItems: Map<number,T[]> = new Map<number,T[]>();
    items.forEach((item) => {
        //parsing to avoid culture problems
      const local = new Date(item.createdAt);
      const fecha = new Date (
            local.getFullYear(), local.getMonth(), local.getDate()
        ).getTime();
      if (!groupedItems.has(fecha)) {
        groupedItems.set(fecha, []);
      }
      const currentItem = groupedItems.get(fecha);
      if (currentItem !== undefined) {
        currentItem?.push(item);
        groupedItems.set(fecha, currentItem);
      }
    });
    return groupedItems;
  }

}

