import { Component, Input } from '@angular/core';
import { UriConstants } from '../../../utils';

@Component({
  selector: 'app-shared-avatar',
  templateUrl: './shared-avatar.component.html',
  styleUrl: './shared-avatar.component.scss'
})
export class SharedAvatarComponent {
  @Input() avatar?: string = UriConstants.USER_AVATAR_DEFAULT;

  handleImageError(event: any){
    event.target.src =  UriConstants.USER_AVATAR_DEFAULT;
  }
}
