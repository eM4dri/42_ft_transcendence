import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdministrationChannelManagementUsersComponent } from '../administration-channel-management-users/administration-channel-management-users.component';
import { ChannelUsersToAdmin } from '../../channel';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-administration-channel-management-actions',
  templateUrl: './administration-channel-management-actions.component.html',
  styleUrls: ['./administration-channel-management-actions.component.scss']
})
export class AdministrationChannelManagementActionsComponent extends BaseComponent<{},{},{},ChannelUsersToAdmin> implements OnInit {
    @Input() userChannel!: ChannelUsersToAdmin;

    ngOnInit(): void {
    }

    constructor(
        private readonly api: ApiService<{},{},{},ChannelUsersToAdmin>,
        private readonly authService: AuthService,
        private readonly parent: AdministrationChannelManagementUsersComponent
    ) {
        super(api);
    }

    patchUser(method: string){
        this.apiService.patchService({
            url: `${UriConstants.ADMIN_MANAGE_CHANNELS}/${method}/${this.userChannel.channelUserId}`,
        }).subscribe({
            next: (res) => {
                this.parent.updateChannelUser(res.response);
            },
            error: error => {
                this.processError(error);
            },
        });
    }

    muteUser(date: Date){
        const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
        const data  = {
            channelUserId: this.userChannel.channelUserId,
            mutedUntill: date
        }
        this.patchService({
            url: `${UriConstants.ADMIN_MANAGE_CHANNELS}/mute/${this.userChannel.channelUserId}`,
            data: data,
            params: {
                headers
            }
        }).subscribe({
            next: (res) => {
                this.parent.updateChannelUser(res.response);
            },
            error: error => {
                this.processError(error);
            },
        });
    }

    processError(error: any){
        // console.log('ERROR!',error);
        this.alertConfiguration('ERROR', error);
        this.openAlert();
        this.loading = true;
    }

    // Desactivamos las acciones sobre nosotros mismos
    disableActions(){
        return this.userChannel.userId === this.authService.getMyUserId()
    }

    isMuted(channelUser: ChannelUsersToAdmin): boolean {
        return this.parent.isMuted(channelUser);
    }
}