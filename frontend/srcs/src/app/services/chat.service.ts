import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MySocket } from './web-socket.service';


export type Message = {
  id: number,
  content: string,
  userId: number,
  date: string,
  userFirstName: string,
  userLastName: string,
}

export type Chat = {
  chatId: string,
  userId: string,
  chatUserId: string,
  userEmail: string
}

export type ChatMessages = {
  chatMessageId: string,
  chatUserId: string,
  email: string,
  createdAt: string,
  updatedAt: string,
  message: string
}

export type ChatMessage = {
  chatId: string,
  listenerId: string,
  message: string,
}


// id	content	userId	date	userFirstName	userLastName

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }

  getChats() {
    this.mysocket.emit('get_chats');
  }

  loadChat(chatId: string | false) {
    this.mysocket.emit('load_chat', chatId);
  }

  sendTyping(msg: string | false) {
    this.mysocket.emit('typing', msg);
  }

  sendMessage(msg: ChatMessage | false) {
    this.mysocket.emit('send_message', msg);
  }

  userListening() {
    return this.mysocket.fromEvent<string>('listening').pipe(map((data) => data));
  }

  chatsAvailables() {
    return this.mysocket.fromEvent<Chat[]>('chats_availables').pipe(map((data) => data));
  }

  chatLoaded() {
    return this.mysocket.fromEvent<ChatMessages[]>('chat_loaded').pipe(map((data) => data));
  }
}
