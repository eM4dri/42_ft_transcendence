import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrationComponent, ChatComponent, GameComponent, HistoryComponent, HomeComponent, NavbarComponent, ProfileComponent, SharedAlertModule } from './modules';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ApiInterceptor, ErrorApiInterceptor } from './core';
import { MySocket } from './services/web-socket.service';
import { ChannelsCache, ChatsCache, UsersCache } from './cache';
import { AvatarComponent, ChannelAvatarComponent, ChannelHeaderComponent, ChannelInfoComponent, ChannelManagementActionsComponent, ChannelManagementComponent, ChannelManagementUsersComponent, ChannelSidebarComponent, ChannelWindowComponent, ChannelWindowMessageComponent, ChatInfoComponent, ChatSidebarComponent, ChatWindowComponent, ChatWindowMessageComponent } from './components';
import { DateMutations } from './utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProfileInfoComponent } from './components/profile/profile-info/profile-info.component';
import { AvatarEditorComponent } from './components/avatar/avatar-editor/avatar-editor.component';
import { OtherProfileComponent } from './modules/profile/other-profile.component/other-profile.component';
import { LoginModule } from './modules/login/login.module';


const config: SocketIoConfig = { url: environment.apiUrl };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    // HistoryComponent,
    ChatComponent,
    ProfileComponent,
    OtherProfileComponent,
    ProfileInfoComponent,
    ChatSidebarComponent,
    ChatWindowComponent,
    ChatInfoComponent,
    ChatWindowMessageComponent,
    NavbarComponent,
    AvatarComponent,
    AvatarEditorComponent,
    ChannelWindowComponent,
    ChannelWindowMessageComponent,
    ChannelSidebarComponent,
    ChannelInfoComponent,
    ChannelAvatarComponent,
    ChannelManagementComponent,
    ChannelManagementUsersComponent,
    ChannelManagementActionsComponent,
    ChannelHeaderComponent,
    AdministrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    SharedAlertModule,
    LoginModule,
    BrowserAnimationsModule,
    TagModule,
    SplitButtonModule,
  ],
  providers: [
    CookieService,
    provideHttpClient(withInterceptors([ApiInterceptor, ErrorApiInterceptor])),
    MySocket,
    UsersCache,
    ChatsCache,
    ChannelsCache,
    DateMutations
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
