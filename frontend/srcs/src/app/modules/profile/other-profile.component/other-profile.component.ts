import { Component } from '@angular/core';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss']
})
export class OtherProfileComponent {

  constructor( ) { }

    otherUserId : string = window.history.state.data.userId;

}
