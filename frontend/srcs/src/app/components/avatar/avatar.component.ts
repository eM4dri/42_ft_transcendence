import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';
import { CachedDataService } from 'src/app/services';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() user!: User;

  constructor(
    private readonly cachedDataService: CachedDataService
  ){ }

  isOnline(userId: string): boolean {
    return this.cachedDataService.isUserConnected(this.user.userId);
  }
}
