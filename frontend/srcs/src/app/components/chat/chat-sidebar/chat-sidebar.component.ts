import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Chat, User } from 'src/app/models';
import { ChatComponent } from 'src/app/modules/chat/chat.component';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent  extends BaseComponent<User> implements OnInit, OnChanges {
  @Input() chatsAvailables!: Chat[];

  currentUsers: Map<string, User> = new Map<string, User>();
  users: User[] = [];
  filteredUsers: User[] = [];

  constructor (
    private readonly api: ApiService<User>,
    private readonly chatComponent: ChatComponent,
    private readonly cachedUsers: UsersCache,
    private readonly authService: AuthService,


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
        this.removeNewChat(chat.userId);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredUsers = this.users;
    this.chatsAvailables.forEach(chat =>{
      if (this.currentUsers.has(chat.userId) === false)
      {
        const user: User | undefined = this.cachedUsers.getUser(chat.userId);
        if (user !== undefined){
          this.currentUsers.set(chat.chatId, user);
        }
        this.removeNewChat(chat.userId);
      }
    });

  }

  searchChat: string= '';

  async createNewChat(){
    
    this.users = (await this.searchArrAsync({
                     url: `${UriConstants.USERS}/all`,
                  })).response.filter(
                    (x) =>
                        x.userId !== this.authService.getMyUserId()
                );
    this.filteredUsers = this.users;
    this.users.forEach( user => {
      this.cachedUsers._setCachedUser(user);
    });
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
    this.currentUsers.delete('new');
  }
  
  loadNewChat(user: User) {
    if (this.chatsAvailables.find( x=> x.userId === user.userId) === undefined){
      this.currentUsers.set('new', user);
    }
    this.chatComponent.loadNewChat(user);
    this.filteredUsers = this.users = [];
  }

  isCurrentChat(chatId: string){
    return this.chatComponent.currentChat.chatId === chatId || chatId === 'new';
  }

  removeNewChat(userId: string){
    const newChatUserId = this.currentUsers.get('new')?.userId;
    if (newChatUserId === userId){
      this.currentUsers.delete('new');
    }
  }

}
