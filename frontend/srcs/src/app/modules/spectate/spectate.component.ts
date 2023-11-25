import { Component } from '@angular/core';
import { User } from 'src/app/models';

export interface LiveGame{
  gameId: string,
  user1: User,
  user2: User,
  score1: number,
  score2: number,
}

@Component({
  selector: 'app-spectate',
  templateUrl: './spectate.component.html',
  styleUrls: ['./spectate.component.scss']
})
export class SpectateComponent {

  games:LiveGame[] = [];
  id:number = 42;

  newGame() {
    const newGame: LiveGame = {
      gameId: `${this.id}`,
      user1:{
        userId: `Local${this.id}`,
        username: `Local${this.id}`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=local${this.id}`
      },
      user2:{
        userId: `Visitor${this.id}`,
        username: `Visitor${this.id}`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=visitor${this.id}`
      },
      score1: 0,
      score2: 0,
    }
    this.games.push(newGame);
    this.id++;
  }

  localScores(game:LiveGame) {
    game.score1++;
  }
  visitorScores(game:LiveGame) {
    game.score2++;
  }
}
