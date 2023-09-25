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
  username: string
}

export type ChatMessages = {
  chatMessageId: string,
  chatUserId: string,
  username: string,
  createdAt: string,
  updatedAt: string,
  message: string
}

export type ChatMessage = {
  chatId?: string,
  listenerId: string,
  message: string,
}

export type ChatUser = {
  // chatId: string,
  userId: string,
  // chatUserId: string,
  username: string,
}


// id	content	userId	date	userFirstName	userLastName

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private readonly mysocket: MySocket,
  ) { }


  loadChat(chatId: string | false) {
    this.mysocket.emit('load_chat', chatId);
  }

  sendTyping(msg: string | false) {
    this.mysocket.emit('typing', msg);
  }

  sendMessage(msg: ChatMessage | false) {
    this.mysocket.emit('send_message', msg);
  }

  sendNewMessage(msg: ChatMessage | false) {
    this.mysocket.emit('send_new_message', msg);
  }

  userListening() {
    return this.mysocket.fromEvent<string>('listening').pipe(map((data) => data));
  }

  usersConnected() {
    return this.mysocket.fromEvent<string[]>('users_connected').pipe(map((data) => data));
  }

  userDisconnects() {
    return this.mysocket.fromEvent<string>('user_disconnects').pipe(map((data) => data));
  }

  userConnects() {
    return this.mysocket.fromEvent<string>('user_connects').pipe(map((data) => data));
  }

  chatsAvailables() {
    return this.mysocket.fromEvent<Chat[]>('chats_availables').pipe(map((data) => data));
  }

  chatLoaded(chatId: string) {
    return this.mysocket.fromEvent<ChatMessages[]>(chatId).pipe(map((data) => data));
  }
}
