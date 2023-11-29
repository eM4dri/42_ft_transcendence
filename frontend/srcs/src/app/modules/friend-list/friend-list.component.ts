import { Component } from '@angular/core';
import { User } from 'src/app/models';
import { ApiService } from 'src/app/services';
import { BaseComponent } from '../shared';
import { UsersCache } from 'src/app/cache';
import { UriConstants } from 'src/app/utils';
import { HttpHeaders } from '@angular/common/http';


export enum EnumFriendListSidebarSelectedTab {
  FRIEND_TAB,
  BLOCK_TAB,
}
@Component({
  selector: 'app-profile',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent extends BaseComponent<string>  {
  selectedTab : number = EnumFriendListSidebarSelectedTab.FRIEND_TAB;
  friendUsers: User[] = [];
  blockedUsers: User [] = [];

  constructor(
    private readonly api: ApiService<string>,
    private readonly cachedUsers: UsersCache
    ) {
      super(api);
      this.apiService.getListService({
        url: `${UriConstants.USER_FRIENDS}/myFriends`,
      }).subscribe({
        next: (data) => {
          const userIds: string[] = data.response;
          userIds.forEach( userId => {
            const user = this.cachedUsers.getUser(userId);
            if (user !== undefined) {
              this.friendUsers.push(user);
            }
          });
        }
      });
      this.apiService.getListService({
        url: `${UriConstants.BLOCK}`,
      }).subscribe({
        next: (data) => {
          const userIds: string[] = data.response;
          userIds.forEach( userId => {
            const user = this.cachedUsers.getUser(userId);
            if (user !== undefined) {
              this.blockedUsers.push(user);
            }
          });
        }
      });
  }

  addFriend(user:User){
    const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
    const data  = {
      friendId: user.userId
    }
    this.createService({
        url: `${UriConstants.USER_FRIENDS}`,
        data: data,
        params: {
            headers
        }
    }).subscribe({
        next: (res) => {
            this.cachedUsers._setCachedUser(user);
            this.friendUsers.push(user);
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  removeFriend(user:User){
    const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
    const data  = {
      friendId: user.userId
    }
    this.apiService.deleteService({
        url: `${UriConstants.USER_FRIENDS}`,
        data: data,
        params: {
            headers
        }
    }).subscribe({
        next: (res) => {
            this.friendUsers = this.friendUsers.filter(x=>x.userId !== user.userId);
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  addBlocked(user:User){
    const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
    const data  = {
      userId_blocked: user.userId
    }
    this.createService({
        url: `${UriConstants.BLOCK}`,
        data: data,
        params: {
            headers
        }
    }).subscribe({
        next: (res) => {
            this.cachedUsers._setCachedUser(user);
            this.blockedUsers.push(user);
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  removeBlocked(user:User){
    const headers = new HttpHeaders()
        .set("Content-Type", "application/json") ;
    const data  = {
      userId_blocked: user.userId
    }
    this.apiService.deleteService({
        url: `${UriConstants.BLOCK}`,
        data: data,
        params: {
            headers
        }
    }).subscribe({
        next: (res) => {
            this.blockedUsers = this.blockedUsers.filter(x=>x.userId !== user.userId);
        },
        error: error => {
            this.processError(error);
        },
    });
  }

  processError(error: any){
    this.alertConfiguration('ERROR', error);
    this.openAlert();
    this.loading = true;
  }


  showFriendsTab() {
    this.selectedTab = EnumFriendListSidebarSelectedTab.FRIEND_TAB;
  }
  
  showBlocksTab() {
    this.selectedTab = EnumFriendListSidebarSelectedTab.BLOCK_TAB;
  }
  
  isFriendsTabSeleted(){
      return  (this.selectedTab === EnumFriendListSidebarSelectedTab.FRIEND_TAB);
  }

}
