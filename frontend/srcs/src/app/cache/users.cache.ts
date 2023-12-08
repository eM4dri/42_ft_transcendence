import { Injectable } from '@angular/core';
import { User } from '../models';
import { UserService } from '../services';
import { UriConstants } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class UsersCache {
  private _conectedUsers = new Set<string>();
  private _blockedUserIds = new Set<string>();
  private _friendUserIds = new Set<string>();

  // private _cachedUsers = new Map<string, User>();

  constructor(
    private readonly userService: UserService
  ) {
    this.userService.usersConnected().subscribe(users => {
      users.forEach(user => {
        this._conectedUsers.add(user);
      });
    });
    this.userService.userDisconnects().subscribe(user => {
      this._conectedUsers.delete(user);
    });
    this.userService.userConnects().subscribe(user => {
      this._conectedUsers.add(user);
    });
    this.userService.usersToCache().subscribe(users => {
      users.forEach(user => {
        this.setCachedUser(user);
      });
    });
    this.userService.friendUserIds().subscribe(users => {
      users.forEach(user => {
        this._friendUserIds.add(user);
      });
    });
    this.userService.blockedUserIds().subscribe(users => {
      users.forEach(user => {
        this._blockedUserIds.add(user);
      });
    });
  }

  addBlockedUserId(userId: string) {
    this._blockedUserIds.add(userId);
  }

  deleteBlockedUserId(userId: string) {
    this._blockedUserIds.delete(userId);
  }

  getBlockedUserIds() {
    return this._blockedUserIds;
  }

  isUserBlocked(userId: string): boolean {
    return this._blockedUserIds.has(userId)
  }

  addFriendUserId(userId: string) {
    this._friendUserIds.add(userId);
  }

  deleteFriendUserId(userId: string) {
    this._friendUserIds.delete(userId);
  }

  getFriendUserIds() {
    return this._blockedUserIds;
  }

  setCachedUser(user: User) {
    const userdata = {
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
    };
    localStorage.setItem(user.userId, JSON.stringify(userdata));
    // if (this._cachedUsers.has(user.userId) === false) {
    //   this._cachedUsers.set(user.userId, user);
    // }
  }

  getConnectedUsers() {
    return this._conectedUsers;
  }

  isUserConnected(userId: string): boolean {
    return this._conectedUsers.has(userId)
  }
  // getUser(userId: string): User | undefined {
  //   return this._cachedUsers.get(userId) || undefined;
  // }
  getUser(userId: string): User {
    const item: string | null = localStorage.getItem(userId);
    if (item !== null) {
      const user: User = JSON.parse(item);
      return user;
    }
    return {
      userId: userId,
      username: userId
    };
  }

  getUserImage(userId: string): string {
    return this.getUser(userId)?.avatar || UriConstants.USER_AVATAR_DEFAULT;
  }

  getUsername(userId: string): string {
    return this.getUser(userId)?.username || "noName";
  }


}

