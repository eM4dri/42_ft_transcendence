import { Component, Input } from '@angular/core';
import { ChatMessages} from 'src/app/models';
import { DateMutations } from 'src/app/utils';

@Component({
  selector: 'app-chat-window-message',
  templateUrl: './chat-window-message.component.html',
  styleUrls: ['./chat-window-message.component.scss']
})
export class ChatWindowMessageComponent {
  @Input() msg!: ChatMessages;
  @Input() clientChatUserId!: string;
  constructor(
    private readonly dateMutations : DateMutations
  )
  {}

  public toTimeLocale(date: string){
    return this.dateMutations.toTimeLocale(date);
  }

}
