import { Component, Input } from '@angular/core';
import { ChatMessages} from 'src/app/models';

@Component({
  selector: 'app-chat-window-message',
  templateUrl: './chat-window-message.component.html',
  styleUrls: ['./chat-window-message.component.scss']
})
export class ChatWindowMessageComponent {
  @Input() msg!: ChatMessages;
  @Input() clientChatUserId!: string;

  public toTimeLocale(date: string){
    return new Date(date).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit", hour12: false  });
  }

}
