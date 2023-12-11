import { Component, Input } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { Channel, User } from 'src/app/models';
import { UriConstants } from 'src/app/utils';

export class EnumAvatarClasses {
  public static readonly ONLINE = 'online';
  public static readonly OFFLINE = 'offline';
  public static readonly BUSY = 'busy';
}

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() user!: User;
  @Input() channel!: Channel

  constructor(
    private readonly cachedUsers: UsersCache
  ){ }

  getStatus(userId: string): string {
    if (this.cachedUsers.isUserPlaying(userId)) {
      return EnumAvatarClasses.BUSY;
    } else if ( this.cachedUsers.isUserConnected(userId)) {
      return EnumAvatarClasses.ONLINE;
    } 
    return EnumAvatarClasses.OFFLINE;
  }

  handleImageError(event: any){
    event.target.src =  UriConstants.USER_AVATAR_DEFAULT;
  }

}