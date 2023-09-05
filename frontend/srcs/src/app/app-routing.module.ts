import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AppComponent } from './app.component';
import { GameComponent } from './modules/game/game.component';
import { HistoryComponent } from './modules/history/history.component';
import { ChatComponent } from './modules/chat/chat.component';
import { ProfileComponent } from './modules/profile/profile.component';

const routes: Routes = [
  {path:"", redirectTo:"", pathMatch:"full"},
  {path:"home", component:HomeComponent},
  {path:"game", component:GameComponent},
  {path:"history", component:HistoryComponent},
  {path:"chat", component:ChatComponent},
  {path:"profile", component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
