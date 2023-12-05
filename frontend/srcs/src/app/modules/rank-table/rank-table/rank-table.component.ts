import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { rankData } from 'src/app/models';

interface rankList extends rankData {
  position: number;
}

@Component({
  selector: 'app-rank-table',
  templateUrl: './rank-table.component.html',
  styleUrl: './rank-table.component.scss',

})
export class RankTableComponent extends BaseComponent<rankData[], {}, {}, {}> implements OnInit {
  ranks: rankData[] = [];
  rank_ext: rankList[] = [];
  filterPost = "";

  constructor(
    private readonly authService: AuthService,
    private api: ApiService<rankData[]>,) {
    super(api)
  }
  ngOnInit(): void {
    this.getranklist()
  }
  getranklist() {
    this.getService({ url: 'http://localhost:3000/stats/rank' }).subscribe({
      next: (response) => {
        this.ranks = response.response
        console.log("response-response", response.response)
        this.rank_ext = this.ranks.map((objeto) => {
          const indice = this.ranks.findIndex(x => x.login === objeto.login);
          return { ...objeto, position: indice }
        })
      }
    })
  }
}
