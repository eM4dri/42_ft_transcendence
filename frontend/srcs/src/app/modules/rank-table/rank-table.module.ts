import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankTableComponent } from './rank-table/rank-table.component'
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/pipes/filter.pipe';

//@Component({
//  selector: 'app-rank-module-table',
//  templateUrl: './rank-table.module.html',
//  //  styleUrl: './rank-table.component.scss',
//})
//export class RankTableComponent { }

@NgModule({
  declarations: [RankTableComponent, FilterPipe],
  imports: [CommonModule, FormsModule],
  exports: [RankTableComponent],
})
export class RankTableModule { }

