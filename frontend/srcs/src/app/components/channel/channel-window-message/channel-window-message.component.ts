import { Component, Input, inject } from '@angular/core';
import { ChannelMessages, User } from 'src/app/models';
import { DateMutations, UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-channel-window-message',
  templateUrl: './channel-window-message.component.html',
  styleUrls: ['./channel-window-message.component.scss']
})
export class ChannelWindowMessageComponent {
  @Input() msg!: ChannelMessages;
  @Input() isBlocked!: boolean;
  @Input() user?:User;
  
  private readonly dateMutations = inject(DateMutations);

  toTimeLocale(date: string){
    return this.dateMutations.toTimeLocale(date);
  }

  handleImageError(event: any){
    event.target.src =  "assets/user-default.svg";
  }
}
