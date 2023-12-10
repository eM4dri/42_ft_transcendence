import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankTableComponent } from './rank-table/rank-table.component'
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { OffCanvasFullStats } from '../fullstats/fullstats.modulle';

@NgModule({
  declarations: [RankTableComponent, FilterPipe],
  imports: [CommonModule, FormsModule, OffCanvasFullStats],
  exports: [RankTableComponent],
})
export class RankTableModule { }

