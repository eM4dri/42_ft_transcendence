import { Component, Input } from '@angular/core';
import { ChannelMessages, ChannelUsersData } from 'src/app/models';

@Component({
  selector: 'app-channel-window-message',
  templateUrl: './channel-window-message.component.html',
  styleUrls: ['./channel-window-message.component.scss']
})
export class ChannelWindowMessageComponent {
  @Input() msg!: ChannelMessages;
  @Input() channelUser?: ChannelUsersData;

  public toTimeLocale(date: string){
    return new Date(date).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit", hour12: false  });
  }

}
