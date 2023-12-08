import { Component, Input, OnInit } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { AlertModel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { PatchUserDto } from 'src/app/models/user/patch-user.model';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  @Input() userId!: string;
  myUserId: string = this.authService.getMyUserId();
  user : any;
  qrCode = '';
  editingUser: boolean = false;
  editingAvatar: boolean = false;
  formGroup: FormGroup
  avatarUrl: string = '';
  friend: boolean = false;
  stats: any;
  alertConfig = new AlertModel.AlertaClass(
    false,
    'Ha ocurrido un error',
    AlertModel.AlertSeverity.ERROR
  );


  ngOnInit(): void {
    this.getUserInfo();
    if (this.myUserId !== this.userId) {
      this.getUserStats(this.userId);
    } else {
      this.getUserStats();
    }
  };

  public patchUser(): void {
    this.editingUser = true;
    const dto: PatchUserDto = this.fillPatchUserDTO(this.formGroup);
    if (!this.checkFormErrors(dto)) {
      this.apiService.patchService({
        url: `${UriConstants.USERS}/${this.userId}`,
        data: dto
      }).subscribe({
        next: (res) => {
            this.user = res;
            this.editingUser = false;
            this.alertConfiguration('SUCCESS', "Changes applied sucessfully");
            this.openAlert();
            this.closeAlert();
        },
        error: () => {
            this.processError('Error updating user information');
        },
      });
    }
  }

  public updateAvatar(url: string): void {
    this.user.avatar = url;
  }

  public enableAvatarEdition(): void {
    this.editingAvatar = true;
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
      },
      error: () => {
          this.processError('Error retrieving qr code');
      },
    });
  }

  public openAlert() {
    this.alertConfig.open = true;
  }

  public disableEdition() {
    this.editingUser = false;
    this.qrCode = '';
  }

  public closeAlert() {
    this.alertConfig.open = false;
  }

  // PRIVATE METHODS

  private getUserInfo() {
    this.apiService.getService({
      url: `${UriConstants.USERS}/${this.userId}`
    }).subscribe({
      next: (res) => {
          this.user = res;
          this.avatarUrl = this.user.avatar;
      },
      error: () => {
          this.processError('Error retrieving user information');
      },
    });
  }

  private getUserStats(userId?: string) {
    const url: string = userId ? `${UriConstants.USER_STATS}/${this.userId}` : `${UriConstants.USER_STATS}`;
    this.apiService.getService({
      url: url
    }).subscribe({
      next: (res: any) => {
          this.stats = res;
      },
      error: () => {
          this.processError('Error retrieving user stats');
      },
    });
  }

  private fillPatchUserDTO(form: FormGroup){
    const twofa: boolean = this.formGroup.get('disableTfa')?.value
    return {
      username: this.formGroup.get('username')?.value ? this.formGroup.get('username')?.value : undefined,
      firstName: this.formGroup.get('firstName')?.value ?  this.formGroup.get('firstName')?.value : undefined,
      lastName: this.formGroup.get('lastName')?.value ? this.formGroup.get('lastName')?.value : undefined,
      email: this.formGroup.get('email')?.value ? this.formGroup.get('email')?.value : undefined,
      twofa: twofa === true ? false : undefined,
      twofa_code: twofa === true ? '' : undefined
    }
  }

  private checkFormErrors(dto: PatchUserDto): boolean {
    if (Object.values(dto).filter(value => value !== undefined).length < 1) {
      this.processError('Istert at least one element to the form');
      return true;
    } else if (dto.username && dto.username.length > 10) {
      this.processError('Username must be less than 10 characters long');
      return true;
    } else if (dto.firstName && dto.firstName.length > 15) {
      this.processError('First name must be less than 15 characters long');
      return true;
    } else if (dto.lastName && dto.lastName.length > 15) {
      this.processError('Last name must be less than 15 characters long');
      return true;
    }
    return false;
  }

  private processError(error: any){
    this.alertConfiguration('ERROR', error);
    this.openAlert();
  }

}