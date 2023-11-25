import { Component, Input } from '@angular/core';
import { User } from 'src/app/models';

@Component({
  selector: 'app-result-card-visitor',
  templateUrl: './result-card-visitor.component.html',
  styleUrls: ['./result-card-visitor.component.scss']
})
export class ResultCardVisitorComponent {
  @Input() user!: User;
}
