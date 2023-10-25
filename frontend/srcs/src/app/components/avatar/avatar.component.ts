import { Component, Input } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { User } from 'src/app/models';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() user!: User;

  constructor(
    private readonly cachedUsers: UsersCache
  ){ }

  isOnline(userId: string): boolean {
    return this.cachedUsers.isUserConnected(userId);
  }
}
