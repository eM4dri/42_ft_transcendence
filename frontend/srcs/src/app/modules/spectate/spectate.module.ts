import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpectateComponent } from './spectate.component';
import { ResultCardComponent, ResultCardPlayerComponent } from 'src/app/components';
import { SharedAvatarModule } from '../shared';



@NgModule({
  declarations: [
    SpectateComponent,
    ResultCardPlayerComponent,
    ResultCardComponent,
  ],
  imports: [
    CommonModule,
    SharedAvatarModule
  ],
  exports: [
    SpectateComponent
  ]
})
export class SpectateModule { 

}
