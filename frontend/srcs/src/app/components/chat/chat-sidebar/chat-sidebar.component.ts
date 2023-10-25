import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Chat, User } from 'src/app/models';
import { ChatComponent } from 'src/app/modules/chat/chat.component';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService, AuthService } from 'src/app/services';
import { SessionStorageConstants, UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent  extends BaseComponent<User> implements OnInit, OnChanges {
  @Input() chatsAvailables!: Chat[];
  @Input() conectedUsers!: Set<string>;

  currentUsers: Map<string, User> = new Map<string, User>();
  users: User[] = [];
  filteredUsers: User[] = [];

  constructor (
    private readonly api: ApiService<User>,
    private readonly chatComponent: ChatComponent,
    private readonly authService: AuthService,
    private readonly cachedUsers: UsersCache,

    ) {
      super(api);
      this.filteredUsers = this.users;
  }

  ngOnInit(): void {
    this.chatsAvailables.forEach(chat =>{
      if (this.currentUsers.has(chat.userId) === false)
      {
        const user: User | undefined = this.cachedUsers.getUser(chat.userId) ;
        if (user !== undefined){
          this.currentUsers.set(chat.chatId, user);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredUsers = this.users;
    this.chatsAvailables.forEach(chat =>{
      if (this.currentUsers.has(chat.userId) === false)
      {
        const user: User | undefined = this.cachedUsers.getUser(chat.userId) ;
        if (user !== undefined){
          this.currentUsers.set(chat.chatId, user);
        }
      }
    });

  }

  searchChat: string= '';

  async createNewChat(){
    this.users = (await this.searchArrAsync({
                     url: `${UriConstants.USERS}/all`,
                  })).response.filter(
                    (x) =>
                        x.userId !==
                        this.authService.readFromCookie(
                            SessionStorageConstants.USER_TOKEN,
                        ).sub,
                ).map(user =>{
                  return {
                      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
                      userId: user.userId,
                      username: user.username,
                  };
                });
    this.filteredUsers = this.users;
  }
 

  filterUsers() {
    if (this.searchChat) {
      this.filteredUsers = this.users.filter(item =>
        item.username.toLowerCase().includes(this.searchChat.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  loadChat(chatId: string) {
    const chat: Chat | undefined = this.chatsAvailables.find(x=>x.chatId===chatId);
    if ( chat!==undefined ) {
      this.chatComponent.loadChat(chat);
    }
  }
  
  loadNewChat(user: User) {

    this.chatComponent.loadNewChat(user);
    this.filteredUsers = this.users = [];
  }

  isCurrentChat(chatId: string){
    return this.chatComponent.currentChat.chatId === chatId;
  }

}
