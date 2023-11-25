import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';

@Component({
  selector: 'app-result-card-local',
  templateUrl: './result-card-local.component.html',
  styleUrls: ['./result-card-local.component.scss']
})
export class ResultCardLocalComponent {
  @Input() user!: User;

}
