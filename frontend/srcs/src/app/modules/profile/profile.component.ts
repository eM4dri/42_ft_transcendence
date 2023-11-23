import { Component } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(
    private authService : AuthService,
    ) { }

    userId : string = this.authService.getMyUserId()

}
