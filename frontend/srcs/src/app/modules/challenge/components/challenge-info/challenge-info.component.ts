import { Component, Input, OnInit, inject } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { User } from 'src/app/models';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrl: './challenge-info.component.scss'
})
export class ChallengeInfoComponent implements OnInit {
  @Input() newChallengerUserId!: string;
  user: User = {
    userId: '42',
    username: 'ramdon',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ramdon'
  }

  private cachedUsers = inject(UsersCache);

  ngOnInit(): void {
    this.user = this.cachedUsers.getUser(this.newChallengerUserId);
  }

  private challengeService = inject(ChallengeService);

  acceptChallenge(){
    this.challengeService.acceptChallenge(this.newChallengerUserId);
  }
  
  rejectChallenge(){
    this.challengeService.rejectChallenge(this.newChallengerUserId);
  }

}
