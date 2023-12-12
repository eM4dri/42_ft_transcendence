import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';

@Component({
  selector: 'app-result-card-player',
  templateUrl: './result-card-player.component.html',
  styleUrls: ['./result-card-player.component.scss']
})
export class ResultCardPlayerComponent {
  @Input() user!: User;

}
