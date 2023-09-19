import { Component } from '@angular/core';
import { ApiService, AuthService, Chat, ChatMessages, ChatService } from 'src/app/services';
import { SessionStorageConstants } from 'src/app/utils';
import { BaseComponent } from '../shared';





@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent  {
  constructor(
    protected readonly api: ApiService,
    protected readonly chatService: ChatService,
    private readonly authService: AuthService
  ) {
    super(api);
    this.chatService.userListening().subscribe(val => {
      console.log('user listening here', val);
        // if (typeof val === 'boolean') {
        //   this.showTyping = false;
        // } else {
        //   this.showTyping = this.userData.id !== val.id;
        // }
    });
    this.chatService.chatsAvailables().subscribe(val => {
      this.chatsAvailables = val;
    });
    this.chatService.chatLoaded().subscribe(val => {
      this.chatMessages = val;
    });


  }
  counter=0;
  inputValue = '';
  jwtToken = '';
  currentChat: Chat = {
    chatId: '0',
    userId: '0',
    chatUserId: '0',
    userEmail: '0'
  };
  chatMessages : ChatMessages[] = [];
  chatsAvailables: Chat[] = [];

  public startChat(user: Chat):void{
    console.log('starting chat', user.chatId, 'with', user.userId);
    // this.currentChat = user;
    // if (user.userId === '1') {
    //   this.messages = this.messages1;
    // } else {
    //   this.messages = [];
    // }
    // console.log(this.messages);

  }

  public sendMessage(): void {
    console.log('Message sent');
  }

  public saveToken(): void {
    // const token : string =  this.cookieService.get(SessionStorageConstants.USER_TOKEN);
    // console.log('token', token);
    console.log('token info', this.authService.readFromCookie(SessionStorageConstants.USER_TOKEN));

  }

  public saveMessage() {
    console.log('saveMessage', this.inputValue);
  
    if (this.inputValue) {
      this.chatService.sendMessage(
        {
          chatId: this.currentChat.chatId,
          message: this.inputValue,
          listenerId: this.currentChat.chatUserId,
        });
      this.inputValue = '';
    }
    this.stopTyping();
  }
  // deleteMessage(id: number){
  //     console.log('deleteMessage');
      // this.delete({url: `${UriConstants.MESSAGES}/${id}`});
  //  }
  public startTyping() {
    console.log('startTyping');
    this.counter++;
    if (this.counter === 1)  this.chatService.sendTyping(this.inputValue);
  }
  public stopTyping() {
    console.log('stopTyping');
    this.counter = 0;
    this.chatService.sendTyping(false);
  }

  public getChats(){    
    this.chatService.getChats();
  }

  public loadChat(chat: Chat){
    this.chatService.loadChat(chat.chatId);
    this.currentChat = chat;
  }
}





