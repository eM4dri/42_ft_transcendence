import { Component, Input } from '@angular/core';
import { LiveGame } from 'src/app/modules/spectate/spectate.component';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent {
  @Input() game!: LiveGame;
}
