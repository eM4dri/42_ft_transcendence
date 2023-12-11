import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { rankData } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { OffCanvasFullStatsComponent } from '../../fullstats/offcanvas/offcanvas.component';

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
  alternative = UriConstants.USER_AVATAR_DEFAULT;

  @ViewChild('childComponent', { static: true }) childComponent!: OffCanvasFullStatsComponent;
  constructor(
    private readonly authService: AuthService,
    private api: ApiService<rankData[]>,) {
    super(api)
  }
  ngOnInit(): void {
    this.getranklist()
  }
  getranklist() {
    this.getService({
      url: `${UriConstants.RANK}`
    }).subscribe({
      next: (response) => {
        this.ranks = response.response
        this.rank_ext = this.ranks.map((objeto) => {
          const indice = this.ranks.findIndex(x => x.login === objeto.login);
          return {
            ...objeto, position: indice
          }
        })
      },
      error: error => {
        this.processError(error);
      },
    });
  }

  abrirOffcanvas(id: string) {
    // Llamar al método del componente hijo para abrir el offcanvas
    this.childComponent.openOffcanvas(id);
  }

  processError(error: any) {
    this.alertConfiguration('ERROR', error);
    this.openAlert();
    this.loading = true;
  }

  handleImageError(event: any) {
    event.target.src = UriConstants.USER_AVATAR_DEFAULT;
  }
}
