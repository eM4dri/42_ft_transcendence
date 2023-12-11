import { Component, OnInit, inject, TemplateRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/modules';
import { ApiService, AuthService } from 'src/app/services';
import { FullStats } from 'src/app/models';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeService } from 'src/app/services/challenge.service';


@Component({
  selector: 'app-full-rank',
  templateUrl: './offcanvas.component.html',
  styleUrl: './offcanvas.component.scss',
})
export class OffCanvasFullStatsComponent extends BaseComponent<FullStats, {}, {}, {}> implements OnInit {
  private offcanvasService = inject(NgbOffcanvas);
  private challengeService = inject(ChallengeService);
  dts: FullStats = {
    "userId": "",
    "login": "",
    "gamesWin": 0,
    "gamesLose": 0,
    "gamesDraw": 0,
    "goalsFavor": 0,
    "goalsAgainst": 0,
    "disconect": 0,
    "points": 0,
    "avatar": "",
    "position": 0,
    "total": 0,
  }
  @ViewChild('content') contentTemplate!: TemplateRef<any>;
  theme = localStorage.getItem('theme') || 'dark';
  constructor(
    private readonly authService: AuthService,
    private api: ApiService<FullStats>,) {
    super(api)
  }

  openOffcanvas(id: string) {
    this.offcanvasService.open(this.contentTemplate, { scroll: true, position: 'end' });

    this.open_offcanvas_fullstats(id)
  }

  ngOnInit(): void {
    this.challengeService.getThemeSub().subscribe(theme=>{
      this.theme = theme;
    })
  }

  open_offcanvas_fullstats(id: string) {
    this.getService({
      url: `http://localhost:3000/stats/list/${id}`
    }).subscribe({
      next: (response) => {
        this.dts = response.response
      }
    })
  }
}
