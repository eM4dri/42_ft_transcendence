import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrationComponent,
         ChatComponent,
         FriendListComponent,
         GameComponent,
         HistoryComponent,
         HomeComponent,
         LoginModule,
         NavbarComponent,
         ProfileComponent,
         SharedAlertModule,
         SharedAvatarModule,
         SpectateModule,
         ChallengeModule } from './modules';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ApiInterceptor, ErrorApiInterceptor } from './core';
import { MySocket } from './services/web-socket.service';
import { ChannelsCache, ChatsCache, UsersCache } from './cache';
import { AvatarComponent,
         BlockSidebarComponent,
         ChannelAvatarComponent,
         ChannelHeaderComponent,
         ChannelInfoComponent,
         ChannelManagementActionsComponent,
         ChannelManagementComponent,
         ChannelManagementUsersComponent,
         ChannelSidebarComponent,
         ChannelWindowComponent,
         ChannelWindowMessageComponent,
         ChatInfoComponent,
         ChatSidebarComponent,
         ChatWindowComponent,
         ChatWindowMessageComponent,
         FriendSidebarComponent,
         AdminstrationUsersListComponent,
         AdminstrationChannelsComponent,
         AdministrationChannelManagementUsersComponent,
         AdministrationChannelManagementActionsComponent,
         AdministrationUsersManagementActionsComponent } from './components';
import { DateMutations } from './utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProfileInfoComponent } from './components/profile/profile-info/profile-info.component';
import { UserAvatarEditorComponent } from './components/avatar/user-avatar-editor/user-avatar-editor.component';
import { OtherProfileComponent } from './modules/profile/other-profile.component/other-profile.component';
import { ProfileAvatarComponent } from './components/avatar/profile-avatar/profile-avatar.component';
import { TooltipModule } from 'primeng/tooltip';
import { RankTableModule } from './modules/rank-table/rank-table.module'
import { TruncatePipe } from './pipes/truncate.pipe';
//import { PongTVComponent } from './modules/pongtv/pongtv.component';
import { ChannelAvatarEditorComponent } from './components/avatar/channel-avatar-editor/channel-avatar-editor.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
//import { PongTVComponent } from './modules/pongtv/pongtv.component';

const config: SocketIoConfig = { url: environment.apiUrl };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
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
    ProfileAvatarComponent,
    ProfileAvatarComponent,
    UserAvatarEditorComponent,
    ChannelAvatarEditorComponent,
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
    AdminstrationUsersListComponent,
    AdminstrationChannelsComponent,
    AdministrationChannelManagementUsersComponent,
    AdministrationChannelManagementActionsComponent,
    AdministrationUsersManagementActionsComponent,
    FriendListComponent,
    ChatSidebarComponent,
    FriendSidebarComponent,
    BlockSidebarComponent,
    TruncatePipe
    //    PongTVComponent,
  ],
  imports: [
    RankTableModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    SharedAlertModule,
    SharedAvatarModule,
    LoginModule,
    SpectateModule,
    BrowserAnimationsModule,
    TagModule,
    SplitButtonModule,
    TooltipModule,
    RankTableModule,
    ChallengeModule,
    NgbDatepickerModule
  ],
  providers: [
    CookieService,
    provideHttpClient(withInterceptors([ApiInterceptor, ErrorApiInterceptor])),
    MySocket,
    UsersCache,
    ChatsCache,
    ChannelsCache,
    DateMutations,
    ChatComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
