import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { GameComponent } from './modules/game/game.component';
import { HistoryComponent } from './modules/history/history.component';
import { ChatComponent } from './modules/chat/chat.component';
import { ProfileComponent } from './modules/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    HistoryComponent,
    ChatComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
