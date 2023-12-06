import { Component, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AlertModel, Channel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from 'src/app/modules';
import { ChannelManagementComponent } from '../../channel';


export type POST= {
  imageUrl: string
}

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

  DropdownOptions : { [key: string]: string } = {
    pixel: "pixel-art",
    avatar: "avataaars",
    bot: "bottts",
    emoji: "fun-emoji",

  }
  @Input() channel! : Channel;
  loadingPage = false;
  editingUser: boolean = false;
  channelAvatar: string | undefined;
  seed: string = '';
  random!: boolean;
  selectedOption: string = 'pixel-art';
  previousAvatar: string | undefined = this.parent.channel.avatar;

  ngOnInit(): void {
    this.channelAvatar = this.channel.avatar;
    console.log(this.channelAvatar)
  }


  changeAvatar() {
    console.log(this.previousAvatar)
    console.log(this.channelAvatar)
    const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
    this.channelAvatar = UriConstants.RAMDON_AVATAR_URL + this.DropdownOptions[dropdown.value] + UriConstants.RAMDON_AVATAR_PATH;
    this.parent.updateAvatar(this.channelAvatar);
  }

  cancelAvatarEdition(): void {
    this.parent.channel.avatar = this.previousAvatar;
    this.parent.editingAvatar = false;
  }

  rollDice() {
    this.seed = this.generateRandomString(5);
    this.channelAvatar = this.channelAvatar + this.seed;
    this.parent.updateAvatar(this.channelAvatar);
    console.log(this.channelAvatar);
  }

  onFileSelected(event: any) {
    console.log('entra')
    const selectedFile: File | null = event.target.files[0];

    if (selectedFile) {
      console.log('Archivo seleccionado:', selectedFile);

      console.log('Nombre del archivo:', selectedFile.name);
      console.log('Tipo de archivo:', selectedFile.type);
      console.log('Tamaño del archivo (bytes):', selectedFile.size);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('channelId', this.channel.channelId);

      this.createService({
        url: `${UriConstants.PROFILE_IMAGES_CHANNELS}/upload_file`,
        data: formData
      }).subscribe({
          next: (res: any) => {
            // Arreglar
            this.channelAvatar = res.imageUrl;
            this.parent.editingAvatar = false;
            this.parent.updateAvatar(res.imageUrl);
          },
          error: error => {
              this.processError(error);
          },
      });


    }
  }

  uploadUrl(url: string): void {

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

  generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charsetLength = charset.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      result += charset.charAt(randomIndex);
    }

    return result;
  }


  processError(error: any){
    // console.log('ERROR!',error);
    this.alertConfiguration('ERROR', error);
    this.openAlert();
    this.loadingPage = true;
  }
}