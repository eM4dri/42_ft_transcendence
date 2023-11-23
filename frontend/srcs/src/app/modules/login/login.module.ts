import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { LoginComponent } from './login.component';
import { SharedAlertModule } from '../shared';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    FormsModule,
    SharedAlertModule,
  ],
  providers: [],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }

