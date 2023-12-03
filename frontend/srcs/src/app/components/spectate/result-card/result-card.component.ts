import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LiveGame } from 'src/app/modules/spectate/spectate.component';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent {
  @Input() game!: LiveGame;
  @Output() spectateEvent = new EventEmitter<LiveGame>();

  spectateGame(game: LiveGame)
  {
    this.spectateEvent.emit(game);
  }
}
