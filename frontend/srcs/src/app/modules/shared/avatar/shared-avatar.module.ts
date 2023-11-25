import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAvatarComponent } from './shared-avatar.component';

@NgModule({
  declarations: [SharedAvatarComponent],
  imports: [
    CommonModule
  ],
  exports: [SharedAvatarComponent]
})
export class SharedAvatarModule { }
