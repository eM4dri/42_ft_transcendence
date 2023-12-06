import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models';
import { UsersCache } from 'src/app/cache';
import { ApiService } from 'src/app/services';
import { UriConstants } from 'src/app/utils';

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

  private cachedUsers = inject(UsersCache);
  private apiService = inject(ApiService);


  ngOnInit(): void {
    this.user = this.cachedUsers.getUser(this.challengingUserId);
  }

  cancelChallenge(){
    this.apiService.getService({
      url: `${UriConstants.CHALLENGE}/cancel/${this.challengingUserId}`,
    }).subscribe();
  }
}

