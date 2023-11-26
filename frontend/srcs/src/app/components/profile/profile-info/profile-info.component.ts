import { Component, Input, OnInit } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { AlertModel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { PatchUserDto } from 'src/app/models/user/patch-user.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserFriendDTO } from 'src/app/models/user/user-friend.model';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  constructor(
    private readonly apiService: ApiService,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    ) {
      this.formGroup = this.fb.group({
        username: [''],
        firstName: [''],
        lastName: [''],
        email: [''],
        disableTfa: ['']
      });
    }

  ngOnInit(): void {

    this.loading = true;
    this.user = this.apiService.getService({
      url: `${UriConstants.USERS}/${this.userId}`
    }).subscribe({
      next: (res) => {
          this.user = res;
          this.avatarUrl = this.user.avatar;
      },
      error: error => {
          this.processError(error);
      },
    });

    if (this.myUserId !== this.userId) {
      this.apiService.getService({
        url: `${UriConstants.USER_FRIENDS}/${this.userId}`
      }).subscribe({
        next: (res: any) => {
            this.friend = res !== null ? true : false;
            console.log('friend')
            console.log(this.friend)  
        },
        error: error => {
            this.processError(error);
        },
      });
    }

  };

  @Input() userId!: string;
  myUserId: string = this.authService.getMyUserId();
  user : any;
  loading = false;
  qrCode = '';
  editingUser: boolean = false;
  editingAvatar: boolean = false;
  formGroup: FormGroup
  avatarUrl: string = '';
  friend: boolean = false;

  alertConfig = new AlertModel.AlertaClass(
    false,
    'Ha ocurrido un error',
    AlertModel.AlertSeverity.ERROR
  );


  patchUser(){

    this.editingUser = true;
    const twofa: boolean = this.formGroup.get('disableTfa')?.value
    const dto: PatchUserDto = {
      // Asigna los valores del formulario al objeto dto
      username: this.formGroup.get('username')?.value ? this.formGroup.get('username')?.value : undefined,
      firstName: this.formGroup.get('firstName')?.value ?  this.formGroup.get('firstName')?.value : undefined,
      lastName: this.formGroup.get('lastName')?.value ? this.formGroup.get('lastName')?.value : undefined,
      email: this.formGroup.get('email')?.value ? this.formGroup.get('email')?.value : undefined,
      twofa: twofa === true ? false : undefined,
      twofa_code: twofa === true ? '' : undefined
    };
    this.apiService.patchService({
        url: `${UriConstants.USERS}/${this.userId}`,
        data: dto
    }).subscribe({
        next: (res) => {
            this.user = res;
            this.editingUser = false;
        },
        error: error => {
            this.processError(error);
        },
    });

  }

  updateAvatar(url: string): void {
    this.user.avatar = url;
    console.log(this.user.avatar);
  }

  enableAvatarEdition(): void {
    this.editingAvatar = true;
    console.log(this.editingAvatar)
  }

  public alertConfiguration(severity: 'ERROR' | 'SUCCESS', msg: string) {
    this.alertConfig.severity = AlertModel.AlertSeverity[severity];
    this.alertConfig.singleMessage = msg;
  }

  public showQRCode(): void {
    this.apiService.getService({
      url: `${UriConstants.TFA}`
    }).subscribe({
      next: (res: any) => {
        this.qrCode = res;
          console.log(res);
      },
      error: error => {
          this.processError(error);
      },
    });

  }

  public addFriend() {
    const dto: UserFriendDTO = {
      friendId: this.userId
    };
    this.apiService.postService({
        url: `${UriConstants.USER_FRIENDS}`,
        data: dto
    }).subscribe({
        next: () => {
          this.friend = true;
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  public deleteFriend() {
    const dto: UserFriendDTO = {
      friendId: this.userId
    };
    this.apiService.deleteService({
        url: `${UriConstants.USER_FRIENDS}`,
        data: dto
    }).subscribe({
        next: () => {
          this.friend = false;
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  public openAlert() {
    this.alertConfig.open = true;
  }

  processError(error: any){
    // console.log('ERROR!',error);
    this.alertConfiguration('ERROR', error);
    this.openAlert();
    this.loading = true;
  }
}