import { Injectable } from '@angular/core';
import { Channel, ChannelMessages, ChannelUsers, ChannelUsersExtended } from '../models';
import { Subject } from 'rxjs';
import { ChannelService } from '../services';
import { DateMutations } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ChannelsCache {
  private _joinedChannelsMap = new Map<string, Channel>();
  private _channelsMessages = new Map<string, ChannelMessages[]>();
  private _channelsUsers = new Map<string, ChannelUsers[]>();
  private _myChannelsUser = new Map<string, ChannelUsersExtended>();

  constructor(
    private readonly channelService: ChannelService,
    private readonly dateMutations: DateMutations
  ){
    this.channelService.joinedChannels().subscribe(channels => {
      channels.forEach(channel => {
          this._joinedChannelsMap.set(channel.channelId, channel);
          this.channelService.myChannelUserLoaded(channel.channelId).subscribe( user => {
              this._myChannelsUser.set(channel.channelId, user);
              this.updatemyChannelUserSub(channel.channelId, user);
          });
          this.channelService.channelUsersLoaded(channel.channelId).subscribe( users => {
              this._setChannelUsers(channel.channelId, users);
          });
          this.channelService.channelMessagesLoaded(channel.channelId).subscribe(messages => {
              this._setChannelMessages(channel.channelId, messages);
          });          
          this.channelService.loadChannelSubscriptions(channel.channelId);
      });
    });
    this.channelService.leaveChannel().subscribe(channelId => {
      this._joinedChannelsMap.delete(channelId);
      this._channelsUsers.delete(channelId);
      this._channelsMessages.delete(channelId);
      this._myChannelsUser.delete(channelId);
      this.updateresetChannelSub(channelId);
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
    this.updateChannelMessagesSub(channelId, this.dateMutations.toDateMap(messages));
  }

  getJoinedChannels():Map< string, Channel >{
    return this._joinedChannelsMap;
  }

  addJoinedChannel(channel: Channel){
    this._joinedChannelsMap.set(channel.channelId, channel);
  }

  addChannelUser(channelId: string, channelUserExtended: ChannelUsersExtended){
    this._myChannelsUser.set(channelId, channelUserExtended);
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
      return this.dateMutations.toDateMap(messages);
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

  getMyChannelUser(channelId: string): ChannelUsersExtended | undefined {
      return this._myChannelsUser.get(channelId);
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

  private myChannelUserSub = new Subject< {channelId:string, myChannelUser: ChannelUsersExtended} >();
  sendmyChannelUserSub(channelId:string, myChannelUser: ChannelUsersExtended) {
      this.myChannelUserSub.next({channelId, myChannelUser});
  }
  getmyChannelUserSub() {
    return this.myChannelUserSub.asObservable();
  }  
  async updatemyChannelUserSub(channelId:string, myChannelUser: ChannelUsersExtended) {
    this.sendmyChannelUserSub(channelId, myChannelUser);
  }

  private resetChannelSub = new Subject<{channelId:string}> ();
  sendresetChannelSub(channelId:string) {
      this.resetChannelSub.next({channelId});
  }
  getresetChannelSub() {
    return this.resetChannelSub.asObservable();
  }  
  async updateresetChannelSub(channelId: string) {
    this.sendresetChannelSub(channelId);
  }

}

