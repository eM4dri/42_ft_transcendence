import { Component, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AlertModel, Channel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from 'src/app/modules';
import { ChannelManagementComponent } from '../../channel';
import { delay } from 'rxjs';

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
  selector: 'app-channel-avatar-editor',
  templateUrl: './channel-avatar-editor.component.html',
  styleUrls: ['./channel-avatar-editor.component.scss']
})
export class ChannelAvatarEditorComponent extends BaseComponent<{},POST> implements OnInit {

  constructor(
    protected api: ApiService<{},POST>,
    private readonly fb: FormBuilder,
    private readonly parent: ChannelManagementComponent,
    ) {
      super(api);
    }

  @Input() channel! : Channel;
  editingUser: boolean = false;
  channelAvatar: string | undefined;
  seed: string = '';
  random!: boolean;
  selectedOption: string = 'pixel-art';
  previousAvatar: string | undefined = this.parent.channel.avatar;

  ngOnInit(): void {
    this.channelAvatar = this.channel.avatar;
  }

  public changeAvatar(): void {
    const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
    this.channelAvatar = UriConstants.RAMDON_AVATAR_URL + DropdownOptions[dropdown.value] + UriConstants.RAMDON_AVATAR_PATH;
    this.parent.updateAvatar(this.channelAvatar);
  }

  public cancelAvatarEdition(): void {
    this.parent.channel.avatar = this.previousAvatar;
    this.parent.editingAvatar = false;
  }

  public rollDice(): void {
    this.seed = this.generateRandomString(5);
    this.channelAvatar = this.channelAvatar + this.seed;
    this.parent.updateAvatar(this.channelAvatar);
  }

  public onFileSelected(event: any) {
    const selectedFile: File | null = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('channelId', this.channel.channelId);
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
      channelId: this.channel.channelId
    }
    this.apiService.postService({
      url: `${UriConstants.PROFILE_IMAGES_CHANNELS}/upload_url`,
      data: dto
    }).subscribe({
        next: () => {
            this.channelAvatar = url;
            this.parent.editingAvatar = false;
            this.parent.updateAvatar(url);
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  private saveFileImage(formData: FormData): void {
    this.createService({
      url: `${UriConstants.PROFILE_IMAGES_CHANNELS}/upload_file`,
      data: formData
    }).subscribe({
        next: (res: any) => {
          this.channelAvatar = res.response.imageUrl;
          this.parent.updateAvatar(res.response.imageUrl);
          this.parent.editingAvatar = false;
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  processError(error: any){
    this.alertConfiguration('ERROR', error);
    this.openAlert();
  }
}
