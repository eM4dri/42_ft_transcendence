import { Component, Input } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { User } from 'src/app/models';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent {
  @Input() user!: User;

  constructor(
    private readonly cachedUsers: UsersCache
  ){ }

  isOnline(userId: string): boolean {
    return this.cachedUsers.isUserConnected(userId);
  }

  handleImageError(event: any){
    event.target.src =  UriConstants.USER_AVATAR_DEFAULT;
  }

}