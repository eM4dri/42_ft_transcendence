import { HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Channel } from 'src/app/models';
import { ChannelsCache } from 'src/app/cache';
import { BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-channel-management',
  templateUrl: './channel-management.component.html',
  styleUrls: ['./channel-management.component.scss']
})
export class ChannelManagementComponent extends BaseComponent<{},Channel> {
  @Input() channel!: Channel;
  constructor(
    private readonly api: ApiService<{},Channel>,
    private readonly fb: FormBuilder,
    private readonly cachedChannels: ChannelsCache
  ) {
    super(api);
    this.formGroup = this.fb.group({
      channelName: ['', Validators.required],
      password: [''],
    });
  }

  saveChannel(){
    if (this.isFormValid()) {
      const { channelName, password } = this.formGroup.value;
      const data  = {
        channelName: channelName,
        password: password
      }
      const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
      this.createService({
        url: `${UriConstants.CHANNELS}`,
        data: data,
        params: {
          headers
        }
      }).subscribe({
        next: (res) => {
          let newChannel: Channel = res.response;
          newChannel.avatar =  `https://api.dicebear.com/7.x/bottts/svg?seed=${channelName}`;
          this.cachedChannels.addJoinedChannel(newChannel)
          this.alertConfiguration('SUCCESS', "Changes applied sucessfully");
          this.openAlert();
          this.loading = false;
        },
        error: error => {
          console.log('ERROR!');
          this.alertConfiguration('ERROR', error);
          this.openAlert();
          this.loading = true;
        },
      });
    }
  }
}
