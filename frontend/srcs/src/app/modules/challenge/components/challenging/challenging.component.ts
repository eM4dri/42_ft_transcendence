import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models';
import { UsersCache } from 'src/app/cache';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-challenging',
  templateUrl: './challenging.component.html',
  styleUrl: './challenging.component.scss'
})
export class ChallengingComponent implements OnInit {
  @Input() challengingUserId!: string;

  user: User = {
    userId: '',
    username: '',
  }
  theme = localStorage.getItem('theme') || 'dark';

  private cachedUsers = inject(UsersCache);
  private apiService = inject(ApiService);
  private challengeService = inject(ChallengeService);

  ngOnInit(): void {
    this.user = this.cachedUsers.getUser(this.challengingUserId);
    this.challengeService.getThemeSub().subscribe(theme => { this.theme = theme });
  }

  cancelChallenge(){
    this.apiService.getService({
      url: `${UriConstants.CHALLENGE}/cancel/${this.challengingUserId}`,
    }).subscribe();
  }
}

