import { Component, Input } from '@angular/core';
import { ChannelMessages, ChannelUsersData } from 'src/app/models';
import { DateMutations } from 'src/app/utils';

@Component({
  selector: 'app-channel-window-message',
  templateUrl: './channel-window-message.component.html',
  styleUrls: ['./channel-window-message.component.scss']
})
export class ChannelWindowMessageComponent {
  @Input() msg!: ChannelMessages;
  @Input() channelUser?: ChannelUsersData;
  constructor(
    private readonly dateMutations : DateMutations
  )
  {}

  public toTimeLocale(date: string){
    return this.dateMutations.toTimeLocale(date);
  }

}
