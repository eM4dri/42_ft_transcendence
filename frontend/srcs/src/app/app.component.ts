import { Component } from '@angular/core';
import { CachedDataService } from './services/cached-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private readonly susbcribedDataService: CachedDataService
    ) { }
  darkMode: boolean = true;




}
