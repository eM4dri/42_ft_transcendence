import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricTableComponent } from 'src/app/components/historic-table/historic-table.component';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { OffCanvasFullStats } from 'src/app/modules/fullstats/fullstats.modulle';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent { }

@NgModule({
  declarations: [HistoryComponent, HistoricTableComponent],
  imports: [CommonModule, TooltipModule, OffCanvasFullStats],
})
export class HistoryModule { }
