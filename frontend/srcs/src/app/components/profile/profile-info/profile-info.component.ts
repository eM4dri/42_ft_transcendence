import { Component, Input, OnInit } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { PatchUserDto } from 'src/app/models/user/patch-user.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { BaseComponent } from 'src/app/modules';
import { UsersCache } from 'src/app/cache';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent extends BaseComponent<string> implements OnInit {

  constructor(
    private readonly api: ApiService<string>,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly cachedUsers: UsersCache,
    ) {
      super(api);
      this.formGroup = this.fb.group({
        username: [''],
        firstName: [''],
        lastName: [''],
        disableTfa: ['']
      });
    }

  @Input() userId!: string;
  myUserId: string = this.authService.getMyUserId();
  user : any;
  qrCode = '';
  editingUser: boolean = false;
  editingAvatar: boolean = false;
  override formGroup: FormGroup
  avatarUrl: string = '';
  friend: boolean = false;
  stats: any;


  ngOnInit(): void {
    if (window.location.pathname === '/profile/new') {
      this.editingUser = true;
    }
    this.getUserInfo();
    if (this.myUserId !== this.userId) {
      this.getUserStats(this.userId);
      this.isUserMyFriend();
    } else {
      this.getUserStats();
    }
  };

  public patchUser(): void {
    this.editingUser = true;
    const dto: PatchUserDto = this.fillPatchUserDTO();
    if (!this.checkFormErrors(dto)) {
      this.patchService({
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
        error: (error) => {
            this.processError(error);
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

  public addFriend(): void {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    const data  = {
      friendId: this.user.userId
    }
    this.createService({
      url: `${UriConstants.USER_FRIENDS}`,
      data: data,
      params: {
          headers
      }
    }).subscribe({
      next: () => {
          this.cachedUsers.setCachedUser(this.user);
          this.friend = true;
      },
      error: error => {
          this.processError(error);
      },
    });
  }

  public deleteFriend(): void {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    const data  = {
      friendId: this.user.userId
    }
    this.apiService.deleteService({
      url: `${UriConstants.USER_FRIENDS}`,
      data: data,
      params: {
          headers
      }
    }).subscribe({
      next: () => {
          this.friend = false;
      },
      error: error => {
          this.processError(error);
      },
    });
  }

  public disableEdition() {
    this.editingUser = false;
    this.qrCode = '';
  }

  // PRIVATE METHODS

  private getUserInfo() {
    this.getService({
      url: `${UriConstants.USERS}/${this.userId}`
    }).subscribe({
      next: (res: any) => {
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
    this.getService({
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

  private isUserMyFriend(): void {
    this.getService({
      url: `${UriConstants.USER_FRIENDS}/${this.userId}`
    }).subscribe({
      next: (res: any) => {
        this.friend = res.response !== null;
      },
      error: (error) => {
        this.processError(error);
      },
    });
  }

  private fillPatchUserDTO(){
    const twofa: boolean = this.formGroup.get('disableTfa')?.value
    return {
      username: this.formGroup.get('username')?.value ? this.formGroup.get('username')?.value : undefined,
      firstName: this.formGroup.get('firstName')?.value ?  this.formGroup.get('firstName')?.value : undefined,
      lastName: this.formGroup.get('lastName')?.value ? this.formGroup.get('lastName')?.value : undefined,
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