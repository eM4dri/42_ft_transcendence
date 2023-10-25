import { Injectable } from '@angular/core';
import { Chat, ChatMessages } from '../models';
import { Subject } from 'rxjs';
import { ChatService } from '../services';

interface MyCreatedAtObject {
  createdAt: string;
  // Otras propiedades que pueda tener su objeto
}
@Injectable({
  providedIn: 'root'
})
export class ChatsCache {
  private _chatsAvailablesMap = new Map<string, Chat >();
  private _chatsAvailables: Chat[] = [];
  private _chatsMessages = new Map<string, ChatMessages[] >();

  constructor(
    private readonly chatService: ChatService,
  ){
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

  getChatsAvailables(){
    return this._chatsAvailables;
  }
  getChatsMessages(){
    return this._chatsMessages;
  }

  getChatMessages(chatId:string){
    const messages = this._chatsMessages.get(chatId);
    if ( messages !== undefined ) {
      return this._toDateMap(messages);
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

