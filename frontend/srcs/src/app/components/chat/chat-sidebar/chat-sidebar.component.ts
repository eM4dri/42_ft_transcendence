import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UsersCache } from 'src/app/cache';
import { Chat, User } from 'src/app/models';
import { ChatComponent } from 'src/app/modules/chat/chat.component';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService, AuthService, GameService } from 'src/app/services';
import { ChallengeService } from 'src/app/services/challenge.service';
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
    private readonly challengeService: ChallengeService,
    private readonly gameService: GameService,
    private readonly router: Router


    ) {
      super(api);
      this.filteredUsers = this.users;
  }

  ngOnInit(): void {
    this.chatsAvailables.forEach(chat =>{
      if (this.currentUsers.has(chat.userId) === false)
      {
        if (!this.cachedUsers.isUserBlocked(chat.userId)) {
          const user: User | undefined = this.cachedUsers.getUser(chat.userId);
          if (user !== undefined){
            this.currentUsers.set(chat.chatId, user);
          }
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
        if (!this.cachedUsers.isUserBlocked(chat.userId)) {
          const user: User | undefined = this.cachedUsers.getUser(chat.userId);
          if (user !== undefined){
            this.currentUsers.set(chat.chatId, user);
          }
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
                        && !this.cachedUsers.isUserBlocked(x.userId)
                );
    this.filteredUsers = this.users;
    this.users.forEach( user => {
      this.cachedUsers.setCachedUser(user);
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

  challengeUserid(userId: string, event: Event) {
    event.stopPropagation();
    this.apiService.getService({
        url: `${UriConstants.CHALLENGE}/${userId}`,
      }).subscribe({
        next: () => {
          this.challengeService.sendChallengingUserIdSub(userId);
          },
          error: error => {
            this.alertConfiguration('ERROR', error);
            this.openAlert();
            this.loading = true;
          },
    });
  }

  isOnline(userId: string): boolean {
    return this.cachedUsers.isUserConnected(userId);
  }

  canSpectate(userId: string): boolean {
    return this.cachedUsers.isUserPlaying(userId);
  }

  spectateGame(userId: string, event: Event) {
    event.stopPropagation();
    const gameId = this.cachedUsers.getLiveGameId(userId);

    const navigationExtras: NavigationExtras = {
      state: { data: { spectate: true  } }
    };

    this.gameService.sendWannaWatch(Number(gameId));
    this.router.navigate(["/game/spectate"], navigationExtras);
  }

}
