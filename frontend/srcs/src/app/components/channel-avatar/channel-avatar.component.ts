import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/models';

@Component({
  selector: 'app-channel-avatar',
  templateUrl: './channel-avatar.component.html',
  styleUrls: ['./channel-avatar.component.scss']
})
export class ChannelAvatarComponent {
  @Input() channel!: Channel;

}

