import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/modules';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-channel-management',
  templateUrl: './channel-management.component.html',
  styleUrls: ['./channel-management.component.scss']
})
export class ChannelManagementComponent extends BaseComponent {
  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder

  ) {
    super(api);
    this.formGroup = this.fb.group({
      channelName: ['', Validators.required],
      password: [''],
    });
  }

  saveChannel(){
    if (this.isFormValid()) {
      // const formData = new FormData();
      const { channelName, password } = this.formGroup.value;
      // formData.append('channelName', channelName);
      // formData.append('password', password);
      // console.log('edu was  here!', formData);
      const data  = {
        channelName: channelName,
        password: password
      }
      const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
      // const headers = { 'Content-Type': 'application/json', 'My-Custom-Header': 'foobar' };
      this.createService({
        url: `${UriConstants.CHANNELS}`,
        data: data,
        params: {
          headers
        }
      }).subscribe({
        next: () => {
          console.log('SUCCESS!');
          this.alertConfiguration('SUCCESS', "Changes saved sucessfully");
          this.openAlert();
          this.loading = false;
        },
        error: error => {
          console.log('ERROR!');
          this.alertConfiguration('ERROR', error);
          this.openAlert();
          this.loading = false;
        }
      });
    }
  }



}
