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
    jwtToken = '';
    currentChat: Chat = {
      chatId: 'none',
      userId: '0',
      chatUserId: '0',
      username: '0'
    };
    private chatsMessages = new Map<string, ChatMessages[] >();
    currentChatMessages:  ChatMessages[] = [];
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
            this.chatsAvailables = chats;
            chats.forEach(chat => {
                this.chatService.loadChat(chat.chatId);   
                this.chatService.chatLoaded(chat.chatId).subscribe(messages => {
                    this.chatsMessages.set(chat.chatId, messages);
                    if (this.currentChat.chatId === 'new' && this.currentChat.userId === chat.userId) {
                        this.currentChat = chat;
                    }
                    else if (this.currentChat.chatId === chat.chatId) {
                        this.currentChatMessages = messages;
                    }
                });  
            });
        });

    }

    public sendMessage() {
        console.log('saveMessage', this.inputValue)

        if (this.inputValue) {
            if (this.currentChat.chatId != 'new') {
                this.chatService.sendMessage({
                    chatId: this.currentChat.chatId,
                    message: this.inputValue,
                    listenerId: this.currentChat.chatUserId,
                });
            } else {
                this.chatService.sendNewMessage({
                    chatId: undefined,
                    message: this.inputValue,
                    listenerId: this.currentChat.userId,
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
        if (this.currentChat.userId !== user.userId) {
            const isChatAvailable = this.chatsAvailables.find(
                (x) => x.userId === user.userId,
            )
            if (!isChatAvailable) {
                this.currentChat.chatId = 'new'
                this.currentChat.chatUserId = '0'
                this.currentChat.userId = user.userId
                this.currentChat.username = user.username
                this.currentChatMessages = []
                this.users = []
            } else {
                this.loadChat(isChatAvailable)
            }
        }
    }

    public loadChat(chat: Chat) {
        const messages = this.chatsMessages.get(chat.chatId);
        if (messages !== undefined )
            this.currentChatMessages = messages;
        // this.chatService.loadChat(chat.chatId)
        this.currentChat = chat
    }
}
