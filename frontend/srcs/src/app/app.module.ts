import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent, GameComponent, HistoryComponent, HomeComponent, NavbarComponent, ProfileComponent, SharedAlertModule } from './modules';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './core';
import { MySocket } from './services/web-socket.service';
import { ChannelsCache, ChatsCache, UsersCache } from './cache';
import { AvatarComponent, ChannelAvatarComponent, ChannelInfoComponent, ChannelSidebarComponent, ChannelWindowComponent, ChannelWindowMessageComponent, ChatInfoComponent, ChatSidebarComponent, ChatWindowComponent, ChatWindowMessageComponent } from './components';
import { DateMutations } from './utils';
import { ChannelManagementComponent } from './components/channel/channel-management/channel-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';


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
    ChatInfoComponent,
    ChatWindowMessageComponent,
    NavbarComponent,
    AvatarComponent,
    ChannelWindowComponent,
    ChannelWindowMessageComponent,
    ChannelSidebarComponent,
    ChannelInfoComponent,
    ChannelAvatarComponent,
    ChannelManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    SharedAlertModule,
    BrowserAnimationsModule,
    TableModule
  ],
  providers: [
    CookieService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    MySocket,
    UsersCache,
    ChatsCache,
    ChannelsCache,
    DateMutations
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
