import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';


@Component({
  selector: 'app-chat-user-info',
  templateUrl: './chat-user-info.component.html',
  styleUrls: ['./chat-user-info.component.scss']
})
export class ChatUserInfoComponent {
  @Input() user!: User;
}
