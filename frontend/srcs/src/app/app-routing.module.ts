import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { GameComponent } from './modules/game/game.component';
import { HistoryComponent } from './modules/history/history.component';
import { ChatComponent } from './modules/chat/chat.component';
import { ProfileComponent } from './modules/profile/profile.component';
import {  LoginGuard } from './guards';

const routes: Routes = [
  
  {path:"", redirectTo:"", pathMatch:"full"},
  {path:"", component:HomeComponent, canActivate: [LoginGuard]},
  {path:"home", component:HomeComponent, canActivate: [LoginGuard]},
  {path:"game", component:GameComponent,canActivate: [LoginGuard]},
  {path:"history", component:HistoryComponent, canActivate: [LoginGuard]},
  {path:"chat", component:ChatComponent, canActivate: [LoginGuard]},
  {path:"profile", component:ProfileComponent, canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
