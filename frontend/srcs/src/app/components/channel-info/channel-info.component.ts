import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/models';

@Component({
  selector: 'app-channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss']
})
export class ChannelInfoComponent {
  @Input() channel!: Channel;
}
