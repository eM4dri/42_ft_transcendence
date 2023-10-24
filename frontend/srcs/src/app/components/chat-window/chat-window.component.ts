import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chat, ChatMessages, User } from 'src/app/models';
import { CachedDataService, ChatService } from 'src/app/services';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
// export class ChatWindowComponent  {
export class ChatWindowComponent implements OnInit, OnChanges {
  @Input() user!: User;
  @Input() chat?: Chat;

  chatMessages: Map<number,ChatMessages[]> = new Map<number,ChatMessages[]>();

  ngOnInit(): void {
    if (this.chat !== undefined ) {
      this.cachedService.getChatMessagesSub().subscribe(res=>{
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
      let messages = this.cachedService.getChatMessages(this.chat.chatId);
      this.chatMessages.clear();
      for(let m of messages) {
        this.chatMessages.set(m[0], m[1]);
      }
    }
  }

  constructor(
    private readonly chatService: ChatService,
    private readonly cachedService: CachedDataService
    ) {   }

  counter=0;
  inputValue: string = '';
 

  public toDayLocale(time: number):string {
    let options: {} = {};
    const today: number = Date.now();
    const daysTillToday = Math.abs((today - time) / (1000 * 60 * 60 * 24));
    if (daysTillToday >  7 ) {
        if (new Date(time).getFullYear !== new Date().getFullYear) {
            options = {
                day: "numeric",
                month: "long",
                year: "numeric",
            };
        } else {
            options = {
                day: "numeric",
                month: "long",
            };
        }
    } else if (daysTillToday > 1 ){
        options = {
            weekday: "long"
        };
    } else if (daysTillToday === 1 ){
        return "yesterday";
    } else {
        return "today";
    }
    return new Date(time).toLocaleDateString([navigator.language], options);
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

}
