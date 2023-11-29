import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HistoricTableComponent } from 'src/app/components/historic-table/historic-table.component';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent { }

@NgModule({
  declarations: [HistoryComponent, HistoricTableComponent],
  imports: [CommonModule],
})
export class HistoryModule { }
