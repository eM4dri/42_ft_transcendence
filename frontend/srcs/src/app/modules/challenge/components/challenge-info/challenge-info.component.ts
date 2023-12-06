import { Component, Input, OnInit, inject } from '@angular/core';
import { UsersCache } from 'src/app/cache';
import { User } from 'src/app/models';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrl: './challenge-info.component.scss'
})
export class ChallengeInfoComponent implements OnInit {
  @Input() newChallengerUserId!: string;
  user: User = {
    userId: '',
    username: '',
  }

  private cachedUsers = inject(UsersCache);
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.user = this.cachedUsers.getUser(this.newChallengerUserId);
  }


  acceptChallenge(){
    this.apiService.getService({
      url: `${UriConstants.CHALLENGE}/accept/${this.newChallengerUserId}`,
    }).subscribe();
  }
  
  rejectChallenge(){;
    this.apiService.getService({
      url: `${UriConstants.CHALLENGE}/reject/${this.newChallengerUserId}`,
    }).subscribe();
  }

}

