import { Component, Input } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { UsersCache } from 'src/app/cache';
import { BaseComponent, FriendListComponent } from 'src/app/modules';
import { User } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-friend-sidebar',
  templateUrl: './friend-sidebar.component.html',
  styleUrls: ['./friend-sidebar.component.scss']
})
export class FriendSidebarComponent extends BaseComponent<User> {
  @Input() friendUsers!: User[];
  users: User[] = [];
  filteredUsers: User[] = [];
  searchUser: string= '';

  constructor (
    private readonly api: ApiService<User>,
    private readonly cachedUsers: UsersCache,
    private readonly authService: AuthService,
    private readonly parent: FriendListComponent,
    private readonly router: Router,

    ) {
      super(api);
      this.filteredUsers = this.users;
  }

  async searchFriend(){
    const currentFriendsIds = new Set(this.friendUsers.map(x=>x.userId));
    const exclude = currentFriendsIds.add(this.authService.getMyUserId());
    this.users = (await this.searchArrAsync({
                     url: `${UriConstants.USERS}/all`,
                  })).response.filter(
                    (x) => !exclude.has(x.userId)
                );
    this.filteredUsers = this.users;
    this.users.forEach( user => {
      this.cachedUsers.setCachedUser(user);
    });
  }
 
  filterUsers() {
    if (this.searchUser) {
      this.filteredUsers = this.users.filter(item =>
        item.username.toLowerCase().includes(this.searchUser.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  addFriend(user: User) {
    this.parent.addFriend(user);
    this.cachedUsers.addFriendUserId(user.userId);
    this.filteredUsers = this.users = [];
    this.searchUser = '';
  }

  removeFriend(user: User) {
    this.parent.removeFriend(user);
    this.cachedUsers.deleteFriendUserId(user.userId);
  }

  public goToUserInfo(user: User) : void {
    const navigationExtras: NavigationExtras = {
      state: { data: { userId: user.userId  } }
    };
    this.router.navigate(['/profile/', user.username], navigationExtras);
  }

}