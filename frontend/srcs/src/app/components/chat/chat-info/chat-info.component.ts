import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';


@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent {
  @Input() user!: User;
}
