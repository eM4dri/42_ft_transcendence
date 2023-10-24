import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { GameComponent } from './modules/game/game.component';
import { HistoryComponent } from './modules/history/history.component';
import { ChatComponent } from './modules/chat/chat.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './core';
import { MySocket } from './services/web-socket.service';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatUserInfoComponent } from './components/chat-user-info/chat-user-info.component';
import { ChatWindowMessageComponent } from './components/chat-window-message/chat-window-message.component';
import { NavbarComponent } from './modules/navbar/navbar.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ChannelWindowComponent } from './components/channel-window/channel-window.component';
import { ChannelWindowMessageComponent } from './components/channel-window-message/channel-window-message.component';
import { ChannelSidebarComponent } from './components/channel-sidebar/channel-sidebar.component';
import { ChannelInfoComponent } from './components/channel-info/channel-info.component';
import { ChannelAvatarComponent } from './components/channel-avatar/channel-avatar.component';

const config: SocketIoConfig = { url: environment.apiUrl };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    HistoryComponent,
    ChatComponent,
    ProfileComponent,
    ChatSidebarComponent,
    ChatWindowComponent,
    ChatUserInfoComponent,
    ChatWindowMessageComponent,
    NavbarComponent,
    AvatarComponent,
    ChannelWindowComponent,
    ChannelWindowMessageComponent,
    ChannelSidebarComponent,
    ChannelInfoComponent,
    ChannelAvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    CookieService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    MySocket
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
