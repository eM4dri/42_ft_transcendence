import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ChannelManagementUsersComponent, ChannelUsersToAdmin } from '../channel-management-users/channel-management-users.component';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { ChannelUsersExtended } from 'src/app/models';

@Component({
  selector: 'app-channel-management-actions',
  templateUrl: './channel-management-actions.component.html',
  styleUrls: ['./channel-management-actions.component.scss']
})
export class ChannelManagementActionsComponent extends BaseComponent<{},{},{},ChannelUsersToAdmin> implements OnInit {
    @Input() userChannel!: ChannelUsersToAdmin;
    @Input() myChannelUser?: ChannelUsersExtended;

    items: MenuItem[]=[];
    readonly promoteItem: MenuItem =  {
        label: 'Promote',
        command: () => {
            this.patchUser('promote');
        }
    };
    readonly demoteItem: MenuItem =  {
        label: 'Demote',
        command: () => {
            this.patchUser('demote');
        }
    };
    readonly banItem: MenuItem =  {
        label: 'Ban',
        command: () => {
            this.patchUser('ban');
        }
    };
    readonly unbanItem: MenuItem =  {
        label: 'Unban',
        command: () => {
            this.patchUser('unban');
        }
    };
    readonly unmuteItem: MenuItem =  {
        label: 'Unmute',
        command: () => {
            this.patchUser('unmute');
        }
    };
    readonly muteItem: MenuItem =  {
        label: 'Mute',
        items: [
            {
                label: '42 mins',
                command: () => {
                    this.muteUser(new Date(Date.now() +  42 * 60000));
                }
            },
            {
                label: '42 hours',
                command: () => {
                    this.muteUser(new Date(Date.now() +  42 * 60000 * 60));
                }
            },
            {
                label: '42 days',
                command: () => {
                    this.muteUser(new Date(Date.now() +  42 * 60000 * 60 * 24));
                }
            },
        ]
    };
    ngOnInit(): void {
        this.items.push(this.userChannel.isAdmin ? this.demoteItem : this.promoteItem);
        this.items.push(this.parent.isMuted(this.userChannel) ? this.unmuteItem : this.muteItem);
        this.items.push(this.userChannel.isBanned ? this.unbanItem : this.banItem);
    }

    constructor(
        private readonly api: ApiService<{},{},{},ChannelUsersToAdmin>,
        private readonly authService: AuthService,
        private readonly parent: ChannelManagementUsersComponent
    ) {
        super(api);
    }

    patchUser(method: string){
        this.apiService.patchService({
            url: `${UriConstants.MANAGE_CHANNELS}/${method}/${this.userChannel.channelUserId}`,
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
            url: `${UriConstants.MANAGE_CHANNELS}/mute`,
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

    disableActions(){
        return ( this.userChannel.userId === this.authService.getMyUserId() ||
            (this.userChannel.leaveAt !== null && !this.userChannel.isBanned));
    }

    isMuted(channelUser: ChannelUsersToAdmin): boolean{
        return this.parent.isMuted(channelUser);
    }


}