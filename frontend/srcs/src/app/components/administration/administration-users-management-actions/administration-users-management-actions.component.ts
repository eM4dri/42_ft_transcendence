import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdministrationChannelManagementUsersComponent } from '../administration-channel-management-users/administration-channel-management-users.component';
import { BaseComponent } from 'src/app/modules';
import { Role, User } from 'src/app/models';
import { UserExtended } from 'src/app/models';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { AdminstrationUsersListComponent } from '../administration-users-list/administration-users-list.component';
import { ExternalExpr } from '@angular/compiler';

@Component({
  selector: 'app-administration-users-management-actions',
  templateUrl: './administration-users-management-actions.component.html',
  styleUrls: ['./administration-users-management-actions.component.scss']
})
export class AdministrationUsersManagementActionsComponent
       extends BaseComponent<{},{},{},UserExtended> implements OnInit
{
    @Input() userExtended!: UserExtended;
    showButtons : boolean = false;

    ngOnInit(): void {
    }

    constructor(
        private readonly api: ApiService<{},{},{},UserExtended>,
        private readonly authService: AuthService,
        private readonly parent: AdminstrationUsersListComponent
    ) {
        super(api);
    }

    patchUser(method: string){
        this.apiService.patchService({
            url: `${UriConstants.ADMIN_MANAGE_USERS}/${method}/${this.userExtended.userId}`,
        }).subscribe({
            next: (res) => {
                // Qué debería hacer aquí? Basta con actualizar el currentUser?
                // Aquí le digo al coleguilla parent que vuelva a pedir los extendedUsers pero es brutal
                this.parent.updateUsers();
            },
            error: error => {
                this.processError(error);
            },
        });
    }

    userIsAdmin() {
        return this.userExtended.role === Role.Admin;
    }

    userIsOwner() {
        return this.userExtended.role === Role.Owner;
    }

    processError(error: any){
        // console.log('ERROR!',error);
        this.alertConfiguration('ERROR', error);
        this.openAlert();
        this.loading = true;
    }

    // Desactivamos las acciones sobre nosotros mismos
    isThisMyself(){
        return this.userExtended.userId === this.authService.getMyUserId();
    }


}