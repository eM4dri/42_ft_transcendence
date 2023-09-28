import { Component } from '@angular/core';
import { ApiService, AuthService, Chat, ChatMessages, ChatService, ChatUser } from 'src/app/services';
import { SessionStorageConstants, UriConstants } from 'src/app/utils';
import { BaseComponent } from '../shared';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent<ChatUser> {
    counter=0;
    inputValue = '';
    itsNewChat: boolean = false;
    itsNewChatUserId: string = '';
    itsNewChatUsername: string = '';
    currentChat: Chat = {
      chatId: 'none',
      userId: '0',
      chatUserId: '0',
      username: '0'
    };
    private chatsMessages = new Map<string, ChatMessages[] >();
    currentChatMessages:  ChatMessages[] = [];
    private _chatsAvailables = new Map<string, Chat >();
    chatsAvailables: Chat[] = [];
    users: ChatUser[] = [];
    conectedUsers = new Set<string>();

    constructor(
        protected readonly api: ApiService<ChatUser>,
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
        this.chatService.usersConnected().subscribe(users => {
            users.forEach(user =>{
                this.conectedUsers.add(user);
            });
        });

        this.chatService.userDisconnects().subscribe(user => {
            this.conectedUsers.delete(user);        
        });

        this.chatService.userConnects().subscribe(user => {
            this.conectedUsers.add(user);        
        });

        this.chatService.chatsAvailables().subscribe(chats => {
            chats.forEach(chat => {
                this._chatsAvailables.set(chat.chatId, chat);
                this.chatService.chatLoaded(chat.chatId).subscribe(messages => {
                    this._setChatMessages(chat.chatId, messages);                    
                });
                this._refreshChatMsgs(chat);
            });
            this.chatsAvailables = Array.from(this._chatsAvailables.values()); 
        });

        this.chatService.newChatAvailable().subscribe(chat => {
            if (!this._chatsAvailables.has(chat.chatId)){
                this._chatsAvailables.set(chat.chatId, chat);
                this.chatService.chatLoaded(chat.chatId).subscribe(messages => {
                    this._setChatMessages(chat.chatId, messages);
                });
                this._refreshChatMsgs(chat);
                this.chatsAvailables = Array.from(this._chatsAvailables.values()); 
            }
        });

    }

    private _refreshChatMsgs(chat: Chat) {
        if (this.itsNewChat === true && this.itsNewChatUserId === chat.userId) {
            this.currentChat = chat;
            this.loadChat(chat);
        }
    }

    private _setChatMessages(chatId: string, messages: ChatMessages[]) {
        let currentChatMsg: ChatMessages[] = this.chatsMessages.get(chatId) || [];
        if (currentChatMsg?.length) {
            messages.forEach(msg => {
                if (currentChatMsg.find(x=>x.chatMessageId === msg.chatMessageId) === undefined) {
                    currentChatMsg.push(msg);
                }
            });
            this.chatsMessages.set(chatId, currentChatMsg);
        } else {
            this.chatsMessages.set(chatId, messages);
            this.currentChatMessages = messages;
        }
    }

    public sendMessage() {
        if (this.inputValue) {
            if (this.itsNewChat===false) {
                this.chatService.sendMessage({
                    chatId: this.currentChat.chatId,
                    message: this.inputValue,
                    listenerId: this.currentChat.chatUserId,
                });
            } else {
                this.chatService.sendNewMessage({
                    chatId: undefined,
                    message: this.inputValue,
                    listenerId: this.itsNewChatUserId,
                });
            }
            this.inputValue = '';
        }
        this.stopTyping();
    }

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

    public async newChat() {
      this.users = (await this.searchArrAsync({
                url: `${UriConstants.USERS}/all`,
            })).response.filter(
                  (x) =>
                      x.userId !==
                      this.authService.readFromCookie(
                          SessionStorageConstants.USER_TOKEN,
                      ).sub,
              );
    }

    public loadNewChat(user: ChatUser) {
        const chat = this.chatsAvailables.find( x=> x.userId === user.userId ) || undefined;
        if (chat === undefined) {
            this.itsNewChat = true;
            this.itsNewChatUserId = user.userId;
            this.itsNewChatUsername = user.username;
            this.currentChat = {
                chatId: 'none',
                userId: '0',
                chatUserId: '0',
                username: '0'
                };
        } else {
            this.loadChat(chat)
        }
        this.users = [];
    }

    public loadChat(chat: Chat) {
        const messages = this.chatsMessages.get(chat.chatId);
        if (messages !== undefined )
            this.currentChatMessages = messages;
        this.currentChat = chat;
        this._resetNewChat();
    }

    _resetNewChat(){
        if (this.itsNewChat) {
            this.itsNewChat = false;
            this.itsNewChatUserId = '';
            this.itsNewChatUsername = '';
        }
    }
}
