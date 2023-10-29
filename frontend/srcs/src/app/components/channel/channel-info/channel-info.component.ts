import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/models';
import { ChatComponent } from 'src/app/modules';

@Component({
  selector: 'app-channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss']
})
export class ChannelInfoComponent {
  @Input() channel!: Channel;

  constructor(
    private readonly chatComponent: ChatComponent
  ) 
  {  }

  manageChannel(){
    this.chatComponent.manageChannel(this.channel);
  }
}
