import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { Channel, ChannelMessages, ChannelUsers, Chat, ChatMessages, User } from '../models';
import { Subject } from 'rxjs';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';
interface MyCreatedAtObject {
  createdAt: string;
  // Otras propiedades que pueda tener su objeto
}
@Injectable({
  providedIn: 'root'
})
export class CachedDataService {
  private _conectedUsers = new Set<string>();

  private _chatsAvailablesMap = new Map<string, Chat >();
  private _chatsAvailables: Chat[] = [];
  private _chatsMessages = new Map<string, ChatMessages[] >();

  private _joinedChannelsMap = new Map<string, Channel>();
  private _channelsMessages = new Map<string, ChannelMessages[]>();
  private _channelsUsers = new Map<string, ChannelUsers[]>();

  private _cachedUsers = new Map<string, User>();

  constructor(
    private readonly chatService: ChatService,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
  ){
    this.userService.usersConnected().subscribe(users => {
        users.forEach(user =>{
            this._conectedUsers.add(user);
        });
    });
    this.userService.userDisconnects().subscribe(user => {
        this._conectedUsers.delete(user);
    });
    this.userService.userConnects().subscribe(user => {
        this._conectedUsers.add(user);
    });

    this.userService.usersToCache().subscribe(users => {
      users.forEach(user =>{
        user.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`;
        if (this._cachedUsers.has(user.userId) === false) {
          this._cachedUsers.set(user.userId, user);
        }
      });
    });

    this.chatService.chatsAvailables().subscribe(chats => {
      chats.forEach(chat => {
          this._chatsAvailablesMap.set(chat.chatId, chat);
          this.chatService.chatLoaded(chat.chatId).subscribe(messages => {
              this._setChatMessages(chat.chatId, messages);
          });
      });
      this.updateChatsAvailablesSub();
    });
    this.chatService.newChatAvailable().subscribe(chat => {
      if (!this._chatsAvailablesMap.has(chat.chatId)){
          this._chatsAvailablesMap.set(chat.chatId, chat);
          this.chatService.chatLoaded(chat.chatId).subscribe(messages => {
              this._setChatMessages(chat.chatId, messages);
          });
          this.updateChatsAvailablesSub();
      }
    });
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

  private _setChatMessages(chatId: string, messages: ChatMessages[]) {
    let currentChatMsg: ChatMessages[] = this._chatsMessages.get(chatId) || [];
    if (currentChatMsg?.length) {
        messages.forEach(msg => {
            if (currentChatMsg.find(x=>x.chatMessageId === msg.chatMessageId) === undefined) {
                currentChatMsg.push(msg);
            }
        });
        this._chatsMessages.set(chatId, currentChatMsg);
    } else {
        this._chatsMessages.set(chatId, messages);
    }
    this.updateChatMessagesSub(chatId, this._toDateMap(messages));
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

  getConnectedUsers(){
    return this._conectedUsers;
  }
  isUserConnected(userId:string): boolean {
    return this._conectedUsers.has(userId)
  }

  getUsername(userId: string): string {
    return this._cachedUsers.get(userId)?.username || "noName"; 
  }

  getUser(userId: string): User | undefined {
      return this._cachedUsers.get(userId) || undefined;
  }

  getUserImage(userId: string): string {
    return this._cachedUsers.get(userId)?.avatar || "https://api.dicebear.com/avatar.svg"; 
  }

  getChatsAvailables(){
    return this._chatsAvailables;
  }
  getChatsMessages(){
    return this._chatsMessages;
  }
  getChannelsMessages(){
    return this._channelsMessages;
  }

  getChannelsUsers(){
    return this._channelsUsers;
  }

  getChatMessages(chatId:string){
    const messages = this._chatsMessages.get(chatId);
    if ( messages !== undefined ) {
      return this._toDateMap(messages);
    }
    return [];
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

  private chatsAvailablesSub = new Subject<Chat[]>();
  sendChatsAvailablesSub(data: Chat[]) {
    this.chatsAvailablesSub.next(data);
  }
  getChatsAvailablesSub() {
    return this.chatsAvailablesSub.asObservable();
  }  
  updateChatsAvailablesSub() {
    this._chatsAvailables = Array.from(this._chatsAvailablesMap.values());
    this.sendChatsAvailablesSub(this._chatsAvailables);
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

  private chatMessagesSub = new Subject< {chatId:string, chatMessages:Map<number, ChatMessages[]>} >();
  sendChatMessagesSub(chatId:string, chatMessages:Map<number, ChatMessages[]>) {
      this.chatMessagesSub.next({chatId, chatMessages});
  }
  getChatMessagesSub() {
    return this.chatMessagesSub.asObservable();
  }  
  async updateChatMessagesSub(chatId:string, chatMessages: Map<number, ChatMessages[]>) {
    this.sendChatMessagesSub(chatId, chatMessages);
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

