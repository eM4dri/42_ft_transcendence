import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';
import { Router, NavigationExtras } from '@angular/router';
import { ChatComponent } from 'src/app/modules';


@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent {
  @Input() user!: User;

  constructor(
    private readonly router: Router,
    protected readonly parent: ChatComponent
  ) { }

  public goToUserInfo(userId: string) : void {

    const navigationExtras: NavigationExtras = {
      state: { data: { userId: userId  } }
    };

    this.router.navigate(['/profile/', this.user.username], navigationExtras);

  }

  public goBackToChat() {
    this.parent.goBackToNoChannel()
  }

}
