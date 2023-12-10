import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { ChannelManagementUsersComponent, ChannelUsersToAdmin } from '../channel-management-users/channel-management-users.component';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { ChannelUsersExtended } from 'src/app/models';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-channel-management-actions',
  templateUrl: './channel-management-actions.component.html',
  styleUrls: ['./channel-management-actions.component.scss']
})
export class ChannelManagementActionsComponent extends BaseComponent<{},{},{},ChannelUsersToAdmin> implements OnInit {
    @Input() userChannel!: ChannelUsersToAdmin;
    @Input() myChannelUser!: ChannelUsersExtended | undefined;
    modalReference: NgbModalRef[] = [];

    ngOnInit(): void {
    }

    constructor(
        private readonly api: ApiService<{},{},{},ChannelUsersToAdmin>,
        private readonly authService: AuthService,
        private readonly modalService: NgbModal,
        private readonly parent: ChannelManagementUsersComponent
    ) {
        super(api);
    }

    today = inject(NgbCalendar).getToday();
	mutedUntill: NgbDateStruct= this.today;

    open(content: TemplateRef<any>) {
        this.modalReference.push(this.modalService.open(content));
    }

    muteUntillDate(){
        console.log('muteUntillDate', this.mutedUntill);
        for (const modal of this.modalReference){
            modal.close();
          }
        const date = new Date(this.mutedUntill.year, this.mutedUntill.month - 1, this.mutedUntill.day);
        this.muteUser(new Date(date));
        this.mutedUntill = this.today;
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
        // Actions are disabled if:
        return (
            // 1. Target user is myself
            this.userChannel.userId === this.authService.getMyUserId()
            // 2. Target user has left at somepoint and is not banned
        ||  (this.userChannel.leaveAt !== null && !this.userChannel.isBanned))
            // 3. Target user is an Owner
        ||  (this.userChannel.isOwner);
    }

    isThisMyself() {
        return this.userChannel.userId === this.authService.getMyUserId();
    }

    isMuted(channelUser: ChannelUsersToAdmin): boolean{
        return this.parent.isMuted(channelUser);
    }

    userIsKicked() :boolean{
        return this.userChannel.leaveAt !== null;
    }

}
