import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-avatar',
  templateUrl: './shared-avatar.component.html',
  styleUrl: './shared-avatar.component.scss'
})
export class SharedAvatarComponent {
  @Input() avatar?: string = "assets/user-default.svg";
  @Input() picturesize?: number = 30;

  handleImageError(event: any){
    event.target.src =  "assets/user-default.svg";
  }
}
