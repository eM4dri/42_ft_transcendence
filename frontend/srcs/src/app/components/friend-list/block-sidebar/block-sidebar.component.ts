
import { Component, Input } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { UsersCache } from 'src/app/cache';
import { BaseComponent, FriendListComponent } from 'src/app/modules';
import { User } from 'src/app/models';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-block-sidebar',
  templateUrl: './block-sidebar.component.html',
  styleUrl: './block-sidebar.component.scss'
})
export class BlockSidebarComponent extends BaseComponent<User> {
  @Input() blockedUsers!: User[];
  users: User[] = [];
  filteredUsers: User[] = [];
  searchUser: string= '';

  constructor (
    private readonly api: ApiService<User>,
    private readonly cachedUsers: UsersCache,
    private readonly authService: AuthService,
    private readonly parent: FriendListComponent

    ) {
      super(api);
      this.filteredUsers = this.users;
  }

  async searchBlocked(){
    const currentBlocksIds = new Set(this.blockedUsers.map(x=>x.userId));
    const exclude = currentBlocksIds.add(this.authService.getMyUserId());
    this.users = (await this.searchArrAsync({
                     url: `${UriConstants.USERS}/all`,
                  })).response.filter(
                    (x) => !exclude.has(x.userId)
                );
    this.filteredUsers = this.users;
    this.users.forEach( user => {
      this.cachedUsers._setCachedUser(user);
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

  addBlocked(user: User) {
    this.parent.addBlocked(user);
    this.filteredUsers = this.users = [];
    this.searchUser = '';
  }

  removeBlocked(user: User) {
    this.parent.removeBlocked(user);
  }


}
