import { Component, OnInit } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { TotalHistoricData } from 'src/app/models/historic/historic.model'
import { BaseComponent } from 'src/app/modules';

@Component({
  selector: 'app-historic-table',
  templateUrl: './historic-table.component.html',
  styleUrl: './historic-table.component.scss',
})
export class HistoricTableComponent extends BaseComponent<TotalHistoricData, {}, {}, {}> implements OnInit {
  games: TotalHistoricData = {
    total: 0,
    skip: 0,
    take: 0,
    result: [],
  };
  constructor(
    private readonly authService: AuthService,
    private api: ApiService<TotalHistoricData>,) {
    super(api)
  }
  ngOnInit(): void {
    this.getdataHistoric(this.authService.getMyUserId());
  }

  getdataHistoric(id: string, skip?: string, take?: string) {
    this.getService({
      url: `http://localhost:3000/historic-games?userId=${id}`
    }).subscribe({
      next: (response) => {
        this.games = response.response
        console.log("games", this.games)
        console.log("response", response.response)
        //  console.log(this.data_list)
      }
    },
      //error => {
      //  // Handle error
      //  console.error('Error fetching data:', error);
    )
  }
}
