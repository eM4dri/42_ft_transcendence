import { Component, Input, inject } from '@angular/core';
import { User } from 'src/app/models';
import { ChallengeService } from 'src/app/services/challenge.service';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge-info',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './challenge-info.component.html',
  styleUrl: './challenge-info.component.scss'
})
export class ChallengeInfoComponent  {
  @Input() userId!: string;
  user: User = {
    userId: '42',
    username: 'ramdon',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ramdon'
  }

  private challengeService = inject(ChallengeService);

  acceptChallenge(){
    this.challengeService.acceptChallenge(this.userId);
  }
  
  rejectChallenge(){
    this.challengeService.rejectChallenge(this.userId);
  }

}
