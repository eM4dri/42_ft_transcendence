import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { GameComponent } from './modules/game/game.component';
import { HistoryComponent } from './modules/history/history.component';
import { ChatComponent } from './modules/chat/chat.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { OtherProfileComponent } from './modules/profile/other-profile.component/other-profile.component';
// import {  LoginGuard } from './guards';
import { AdministrationComponent } from './modules';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  { path: "", redirectTo: "", pathMatch: "full" },
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "game", component: GameComponent, canActivate: [AuthGuard] },
  { path: "history", component: HistoryComponent, canActivate: [AuthGuard] },
  { path: "chat", component: ChatComponent, canActivate: [AuthGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "profile/:username", component: OtherProfileComponent, canActivate: [AuthGuard] },
  {
    path: "administration", component: AdministrationComponent, canActivate: [AuthGuard], data: {
      role: Role.Admin
    }
  },
  { path: "login", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
