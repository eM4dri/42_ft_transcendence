import { Component, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AlertModel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { FormBuilder } from '@angular/forms';
import { ProfileInfoComponent } from '../../profile/profile-info/profile-info.component';
import { BaseComponent } from 'src/app/modules';


export type POST= {
  imageUrl: string
}

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

  DropdownOptions : { [key: string]: string } = {
    pixel: "pixel-art",
    avatar: "avataaars",
    bot: "bottts",
    emoji: "fun-emoji",

  }
  @Input() userAvatar! : string;
  loadingPage = false;
  editingUser: boolean = false;
  avatarUrl: string = this.parent.avatarUrl;
  seed: string = '';
  random!: boolean;
  selectedOption: string = 'pixel-art';
  previousAvatar: string = this.parent.avatarUrl;


  changeAvatar() {
    const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
    console.log('changeAvatar');
    this.avatarUrl = UriConstants.RAMDON_AVATAR_URL + this.DropdownOptions[dropdown.value] + UriConstants.RAMDON_AVATAR_PATH;
    this.parent.updateAvatar(this.avatarUrl);
    console.log(this.avatarUrl)
  }

  cancelAvatarEdition(): void {
    this.parent.user.avatar = this.previousAvatar;
    this.parent.editingAvatar = false;
  }

  rollDice() {
    console.log(this.avatarUrl);
    this.seed = this.generateRandomString(5);
    this.userAvatar = this.avatarUrl + this.seed;
    this.parent.updateAvatar(this.userAvatar);
  }

  onFileSelected(event: any) {
    const selectedFile: File | null = event.target.files[0];

    if (selectedFile) {
      console.log('Archivo seleccionado:', selectedFile);

      console.log('Nombre del archivo:', selectedFile.name);
      console.log('Tipo de archivo:', selectedFile.type);
      console.log('Tamaño del archivo (bytes):', selectedFile.size);

      const formData = new FormData();
      formData.append('file', selectedFile);
      const dto = {
        file: formData,
      }
      console.log(dto)

      this.createService({
        url: `${UriConstants.PROFILE_IMAGES_USERS}/upload_file`,
        data: formData
      }).subscribe({
          next: (res: any) => {
            // Arreglar
            this.userAvatar = res.imageUrl;
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