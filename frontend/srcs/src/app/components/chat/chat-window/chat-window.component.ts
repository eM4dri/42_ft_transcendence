import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChatsCache } from 'src/app/cache';
import { Chat, ChatMessages, User } from 'src/app/models';
import { ChatService } from 'src/app/services';
import { DateMutations } from 'src/app/utils';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})

export class ChatWindowComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() user!: User;
  @Input() chat?: Chat;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  chatMessages: Map<number,ChatMessages[]> = new Map<number,ChatMessages[]>();

  ngOnInit(): void {
    if (this.chat !== undefined ) {
      this.cachedChats.getChatMessagesSub().subscribe(res=>{
        if (res.chatId === this.chat!.chatId) {
          let messages = res.chatMessages;
          for (let m of messages){
            let dayMessages = this.chatMessages.get(m[0]);
            if (dayMessages !== undefined){
              this.chatMessages.set(m[0], dayMessages?.concat(m[1]));
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
    private readonly chatService: ChatService,
    private readonly cachedChats: ChatsCache,
    private readonly dateMutations: DateMutations
    ) {   }

  counter=0;
  inputValue: string = '';
 

  public toDayLocale(time: number):string {
    return this.dateMutations.toDayLocale(time);
  }

  public sendMessage() {
    if (this.inputValue) {
        if (this.chat !== undefined) {
            this.chatService.sendMessage({
                chatId: this.chat.chatId,
                message: this.inputValue,
                listenerId: this.chat.chatUserId,
            });
        } else {
            this.chatService.sendNewMessage({
                chatId: undefined,
                message: this.inputValue,
                listenerId: this.user.userId,
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
