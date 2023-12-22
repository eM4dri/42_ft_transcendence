import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, TemplateRef, inject } from '@angular/core';
import { AdministrationChannelManagementUsersComponent } from '../administration-channel-management-users/administration-channel-management-users.component';
import { ChannelUsersToAdmin } from '../../channel';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-administration-channel-management-actions',
  templateUrl: './administration-channel-management-actions.component.html',
  styleUrls: ['./administration-channel-management-actions.component.scss']
})
export class AdministrationChannelManagementActionsComponent extends BaseComponent<{},{},{},ChannelUsersToAdmin> implements OnInit, OnChanges {
    @Input() userChannel!: ChannelUsersToAdmin;
    modalReference: NgbModalRef[] = [];

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        this.parent.updateChannelUser(this.userChannel);
    }

    constructor(
        private readonly api: ApiService<{},{},{},ChannelUsersToAdmin>,
        private readonly authService: AuthService,
        private readonly modalService: NgbModal,
        private readonly parent: AdministrationChannelManagementUsersComponent
    ) {
        super(api);
    }

    today = inject(NgbCalendar).getToday();
	mutedUntill: NgbDateStruct= this.today;

    open(content: TemplateRef<any>) {
        this.modalReference.push(this.modalService.open(content));
    }

    muteUntillDate(){
        for (const modal of this.modalReference){
            modal.close();
          }
        const date = new Date(this.mutedUntill.year, this.mutedUntill.month - 1, this.mutedUntill.day);
        this.muteUser(new Date(date));
        this.mutedUntill = this.today;
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
        this.alertConfiguration('ERROR', error);
        this.openAlert();
        this.loading = true;
    }

    // Desactivamos las acciones sobre nosotros mismos
    isThisMyself(){
        return this.userChannel.userId === this.authService.getMyUserId()
    }

    isMuted(channelUser: ChannelUsersToAdmin): boolean {
        return this.parent.isMuted(channelUser);
    }

    userIsKicked() :boolean{
        return this.userChannel.leaveAt !== null;
    }
}