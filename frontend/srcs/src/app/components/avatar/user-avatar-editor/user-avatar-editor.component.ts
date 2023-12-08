import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AlertModel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { FormBuilder } from '@angular/forms';
import { ProfileInfoComponent } from '../../profile/profile-info/profile-info.component';
import { BaseComponent } from 'src/app/modules';


export type POST= {
  imageUrl: string
}

export const DropdownOptions: { [key: string]: string } = {
  pixel: "pixel-art",
  avatar: "avataaars",
  bot: "bottts",
  emoji: "fun-emoji",
};

@Component({
  selector: 'app-user-avatar-editor',
  templateUrl: './user-avatar-editor.component.html',
  styleUrls: ['./user-avatar-editor.component.scss']
})
export class UserAvatarEditorComponent extends BaseComponent<{},POST> {

  constructor(
    protected api: ApiService<{},POST>,
    private readonly fb: FormBuilder,
    private readonly parent: ProfileInfoComponent,
    ) {
      super(api);
    }

  @Input() userAvatar! : string;
  editingUser: boolean = false;
  avatarUrl: string = this.parent.avatarUrl;
  seed: string = '';
  random!: boolean;
  selectedOption: string = 'pixel-art';
  previousAvatar: string = this.parent.avatarUrl;


  public changeAvatar(): void {
    const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
    this.avatarUrl = UriConstants.RAMDON_AVATAR_URL + DropdownOptions[dropdown.value] + UriConstants.RAMDON_AVATAR_PATH;
    this.parent.updateAvatar(this.avatarUrl);
  }

  public cancelAvatarEdition(): void {
    this.parent.user.avatar = this.previousAvatar;
    this.parent.editingAvatar = false;
  }

  public rollDice(): void {
    this.seed = this.generateRandomString(5);
    this.userAvatar = this.avatarUrl + this.seed;
    this.parent.updateAvatar(this.userAvatar);
  }

  public onFileSelected(event: any): void {
    const selectedFile: File | null = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      this.saveFileImage(formData);
    }
  }

  public uploadUrl(url: string): void {
    this.saveUrlImage(url);
  }

  // PRIVATE METHODS


  private generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charsetLength = charset.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      result += charset.charAt(randomIndex);
    }
    return result;
  }

  private saveUrlImage(url: string): void {
    const dto = {
      url: url,
    }
    this.apiService.postService({
      url: `${UriConstants.PROFILE_IMAGES_USERS}/upload_url`,
      data: dto
    }).subscribe({
        next: () => {
            this.userAvatar = url;
            this.parent.editingAvatar = false;
            this.parent.updateAvatar(url);
        },
        error: () => {
            this.processError('Error uploading image url');
        },
    });
  }

  private saveFileImage(formData: FormData): void {
    this.createService({
      url: `${UriConstants.PROFILE_IMAGES_USERS}/upload_file`,
      data: formData
    }).subscribe({
        next: (res: any) => {
          this.userAvatar = res.imageUrl;
          this.parent.editingAvatar = false;
          this.parent.updateAvatar(res.imageUrl);
        },
        error: () => {
            this.processError('Error uploading image file');
        },
    });
  }

  private processError(error: any){
    this.alertConfiguration('ERROR', error);
    this.openAlert();
  }

}