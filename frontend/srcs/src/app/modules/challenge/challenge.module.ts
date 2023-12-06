import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeComponent, ChallengeInfoComponent, ChallengingComponent } from './components';
import { SharedAvatarModule } from '../shared';


@NgModule({
  declarations: [
    ChallengeComponent,
    ChallengeInfoComponent,
    ChallengingComponent
  ],
  imports: [
    CommonModule,
    SharedAvatarModule,
  ],
  exports: [ChallengeComponent]

})
export class ChallengeModule { }
