import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MySocket } from './web-socket.service';
import { Chat, ChatMessage, ChatMessages } from '../models/chat/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  sendTyping(msg: string | false) {
    this.mysocket.emit('typing', msg);
  }

  sendMessage(msg: ChatMessage | false) {
    this.mysocket.emit('send_message', msg);
  }

  sendNewMessage(msg: ChatMessage | false) {
    this.mysocket.emit('send_new_message', msg);
  }

  chatsAvailables() {
    return this.mysocket.fromEvent<Chat[]>('chats_availables').pipe(map((data) => data));
  }

  newChatAvailable() {
    return this.mysocket.fromEvent<Chat>('new_chat_available').pipe(map((data) => data));
  }

  chatLoaded(chatId: string) {
    return this.mysocket.fromEvent<ChatMessages[]>(chatId).pipe(map((data) => data));
  }
}
