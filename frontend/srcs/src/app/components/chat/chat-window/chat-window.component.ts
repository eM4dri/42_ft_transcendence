import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChatsCache, UsersCache } from 'src/app/cache';
import { Chat, ChatMessages, User } from 'src/app/models';
import { BaseComponent, ChatComponent } from 'src/app/modules';
import { ApiService, ChatService } from 'src/app/services';
import { DateMutations, UriConstants } from 'src/app/utils';

export interface PostMessage  {
  chatId: string,
  message: ChatMessages,
  chatUserIdListener?: string
}

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})

export class ChatWindowComponent extends BaseComponent<{},PostMessage> implements OnInit, OnChanges, AfterViewChecked {
  @Input() user!: User;
  @Input() chat?: Chat;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  chatMessages: Map<number,ChatMessages[]> = new Map<number,ChatMessages[]>();

  ngOnInit(): void {
    if (this.chat !== undefined ) {
      this.cachedChats.getChatMessagesSub().subscribe(res=>{
        if (res.chatId === this.chat!.chatId) {
          const messages = res.chatMessages;
          for (const m of messages){
            const dayMessages = this.chatMessages.get(m[0]);
            if (dayMessages !== undefined){
              for (const dm of m[1]){   // iter through subscribed messages received
                if (dayMessages.find(x=>x.chatMessageId !== dm.chatMessageId)){ // avoid duplicates checking if I haven't got msg earlier
                  this.chatMessages.set(m[0], dayMessages?.concat(m[1]));
                }
              } 
            } else {
              this.chatMessages.set(m[0], m[1]);
            }
          }
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chat !== undefined ) {
      let messages = this.cachedChats.getChatMessages(this.chat.chatId);
      this.chatMessages.clear();
      for(let m of messages) {
        this.chatMessages.set(m[0], m[1]);
      }
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  constructor(
    private readonly api: ApiService<{},PostMessage>,
    private readonly chatService: ChatService,
    private readonly cachedChats: ChatsCache,
    private readonly dateMutations: DateMutations,
    private readonly cachedUsers: UsersCache,
    private readonly chatComponent: ChatComponent
    ) { 
      super(api);
    }

  counter=0;
  inputValue: string = '';
 
  public toDayLocale(time: number):string {
    return this.dateMutations.toDayLocale(time);
  }

  public sendMessage() {
    if (this.inputValue) {
        if (this.chat !== undefined) {
          this.createService({
            url: `${UriConstants.MESSAGE}`,
            data: { chatId: this.chat.chatId, message: this.inputValue, listenerId: this.chat.chatUserId }
          }).subscribe({
            next: data => {
            //  console.log(data.response);
            },
            error: error => {
              this.alertConfiguration('ERROR', error);
              this.openAlert();
              this.loading = false;
            },
          });
        } else {
            this.createService({
              url: `${UriConstants.MESSAGE}`,
              data: { listenerId: this.user.userId, message: this.inputValue }
            }).subscribe({
              next: data => {
                const { chatId, message, chatUserIdListener }  = data.response;
                const chat = {
                  chatId: chatId,
                  userId: this.user.userId,
                  chatUserId: chatUserIdListener || 'unknown',
                }
                this.cachedUsers.setCachedUser(this.user);
                this.chatComponent.loadChat(chat);
              },
              error: error => {
                this.alertConfiguration('ERROR', error);
                this.openAlert();
                this.loading = false;
              },
            });
        }
        this.inputValue = '';
    }
    this.stopTyping();
  }

  //TODO start & stopTyping
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

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
