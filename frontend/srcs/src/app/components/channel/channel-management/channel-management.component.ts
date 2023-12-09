import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Channel, ChannelUsersExtended } from 'src/app/models';
import { ChannelsCache } from 'src/app/cache';
import { BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

export interface PostChannel {
  channel: Channel,
  channelUser: ChannelUsersExtended
}

@Component({
  selector: 'app-channel-management',
  templateUrl: './channel-management.component.html',
  styleUrls: ['./channel-management.component.scss']
})
export class ChannelManagementComponent extends BaseComponent<{},PostChannel> implements OnInit, OnChanges {
  @Input() channel!: Channel;
  isLocked: boolean = false;
  avatarUrl!: string;
  editingAvatar: boolean = false;
  constructor(
    private readonly api: ApiService<{},PostChannel>,
    private readonly fb: FormBuilder,
    private readonly cachedChannels: ChannelsCache
  ) {
    super(api);
    this.formGroup = this.fb.group({
      channelName: [''],
      currentPassword: [''],
      password: [''],
      confirmPassword: [''],
    });
  }

  ngOnInit(): void {
    this.isChannelLocked();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isChannelLocked();
  }

  public saveChannel(): void{
    if (this.isFormValid()) {
      const { channelName, currentPassword, password, confirmPassword} = this.formGroup.value;
      if (password !== confirmPassword) {
        this.alertConfiguration('ERROR', 'Passwords must be the same.');
        this.openAlert();
        this.loading = true;
        return ;
      }
      if (channelName.length > 20) {
        this.alertConfiguration('ERROR', 'Channel name too long');
        this.openAlert();
        this.loading = true;
        return ;
      }
      const data  = {
        channelName: channelName,
        password: password
      }
      const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
      if (channelName) {
        this.createService({
          url: `${UriConstants.CHANNEL}`,
          data: data,
          params: {
            headers
          }
        }).subscribe({
          next: (res) => {
            const {channel, channelUser} = res.response
            // this.cachedChannels.addJoinedChannel(channel)
            // this.cachedChannels.addChannelUser(channel.channelId, channelUser);
            this.alertConfiguration('SUCCESS', "Changes applied sucessfully");
            this.openAlert();
            this.loading = false;
          },
          error: error => {
            this.alertConfiguration('ERROR', error);
            this.openAlert();
            this.loading = true;
          },
        });
      } else {
        this.updateChannel(this.channel.channelId, password, currentPassword);
      }
    }
  }

  public updateChannel(channelId: string, password: string, currentPassword: string): void {
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json");
    const data  = {
      password: password,
      currentPassword: currentPassword
    }
    this.patchService({
      url: `${UriConstants.CHANNEL}/${channelId}`,
      data: data,
      params: {
        headers
      }
    }).subscribe({
      next: () => {
        this.alertConfiguration('SUCCESS', "Changes applied sucessfully");
        this.openAlert();
        this.loading = false;
      },
      error: error => {
        this.alertConfiguration('ERROR', error);
        this.openAlert();
        this.loading = true;
      },
    });
  }

  public updateAvatar(url: string): void {
    this.channel.avatar = url;
    this.avatarUrl = url
  }

  // PRIVATE METHODS


  private isChannelLocked(): void {
    if (this.channel.channelId !== 'none') {
      this.getService({
        url: `${UriConstants.CHANNEL}/${this.channel.channelId}/isLocked`
      }).subscribe({
        next: (res: any) => {
          this.channel.isLocked = res.response;
        },
        error: () => {
            this.processError('Error retrieving channel information');
        },
      });
    }
  }

  private processError(error: any): void {
    this.alertConfiguration('ERROR', error);
    this.openAlert();
  }
}
