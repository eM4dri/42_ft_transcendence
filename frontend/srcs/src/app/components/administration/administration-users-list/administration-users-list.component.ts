import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { User, UserExtended } from 'src/app/models';
import { BaseComponent } from 'src/app/modules/shared';
import { ApiService,AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import {AdministrationComponent} from 'src/app/modules/administration/administration.component'

// Robao y editao de chat-sidebar.component
@Component({
  selector: 'administration-users-list',
  templateUrl: './administration-users-list.component.html',
  styleUrls: ['./administration-users-list.component.scss']
})
export class AdminstrationUsersListComponent extends BaseComponent<UserExtended> implements OnInit, OnChanges {

  // Esto significa que recibe un user por parte de su llamador.
  @Input() currentUser!: User;

  showButtonsState: { [userId: string]: boolean } = {};

  setShowButtons(user: User, value : boolean) {
    this.showButtonsState[user.userId] = value;
  }

  isShowButtons(user: User) {
      return this.showButtonsState[user.userId];
  }

  users: UserExtended[] = [];
  filteredUsers: UserExtended[] = [];

  constructor (
    private readonly api: ApiService<UserExtended>,
    private readonly authService: AuthService,
    private readonly administrationComponent : AdministrationComponent
    ) {
      super(api);
      this.filteredUsers = this.users;
  }

  // En teoria, esto puede ser async. Es la unica forma de que no haya que interactuar
  // para que se muestren los usuarios de db.
  async ngOnInit() : Promise<void>{
    await this.updateUsers();
  }

  // Esto no se bien bien por qué se hace. Lo dejo así y ya veremos
  async ngOnChanges(changes: SimpleChanges) : Promise<void> {
    await this.updateUsers();
  }

  async updateUsers() {
    this.users = (await this.searchArrAsync({
                      url: `${UriConstants.ADMIN_MANAGE_USERS}/all/extendedusers`,
                  })).response.filter(
                    (x) => x.userId !== this.authService.getMyUserId()
                );
    this.filterUsers();
  }

  absorbClick() {
  }

  // Lo que se escribe en el prompt.
  userSearchInput: string= '';

  filterUsersIfNeeded() {
    this.filterUsers();
  }

  filterUsers() {
    if (this.userSearchInput) {
      this.filteredUsers = this.users.filter(item =>
        item.username.toLowerCase().includes(this.userSearchInput.toLowerCase())
      );
      // Los filteredUsers tambien hay que ordenarlos sino se vuelven locos
      // cuando updateo
      this.filteredUsers = this.filteredUsers.sort(
        (a,b) => a.username.localeCompare(b.username)
      );
    } else {
      this.filteredUsers = this.users.sort(
          (a,b) => a.username.localeCompare(b.username)
        );
    }
  }

  getBackgroundColor(role: string) : string {
    switch (role) {
      case 'OWNER':
        return 'linear-gradient(-225deg, #b3ffcc 0%, #00cc66 48%, #006622 100%)';
      case 'ADMIN':
            return 'linear-gradient(-225deg, #AC32E4 0%, #7918F2 48%, #4801FF 100%)';
      case 'USER':
          return 'linear-gradient(-225deg, #8fbce0 0%, #3399ff 48%, #004080 100%)';
      default:
          return 'linear-gradient(-225deg, #CCCCCC, #CCCCCC)'
    }
  }

  userClicked(user : User) {
    this.currentUser = user;
  }
}
