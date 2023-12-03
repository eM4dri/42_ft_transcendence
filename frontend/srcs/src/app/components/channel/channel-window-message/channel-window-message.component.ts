import { Component, Input } from '@angular/core';
import { ChannelMessages } from 'src/app/models';
import { DateMutations } from 'src/app/utils';
import { ChannelUsersData } from '../channel-window/channel-window.component';

@Component({
  selector: 'app-channel-window-message',
  templateUrl: './channel-window-message.component.html',
  styleUrls: ['./channel-window-message.component.scss']
})
export class ChannelWindowMessageComponent {
  @Input() msg!: ChannelMessages;
  @Input() channelUser?: ChannelUsersData;
  @Input() isBlocked!: boolean;
  constructor(
    private readonly dateMutations : DateMutations
  )
  {}

  public toTimeLocale(date: string){
    return this.dateMutations.toTimeLocale(date);
  }

}
