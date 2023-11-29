import { Injectable } from '@angular/core';
import { User } from '../models';
import { UserService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class UsersCache {
  private _conectedUsers = new Set<string>();
  // private _cachedUsers = new Map<string, User>();

  constructor(
    private readonly userService: UserService
  ){
    this.userService.usersConnected().subscribe(users => {
        users.forEach(user =>{
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
      users.forEach(user =>{
        this._setCachedUser(user);
      });
    });
  }

  public  _setCachedUser(user: User) {
    localStorage.setItem(user.userId, JSON.stringify(user));
    // if (this._cachedUsers.has(user.userId) === false) {
    //   this._cachedUsers.set(user.userId, user);
    // }
  }

  getConnectedUsers(){
    return this._conectedUsers;
  }
  isUserConnected(userId:string): boolean {
    return this._conectedUsers.has(userId)
  }
  // getUser(userId: string): User | undefined {
  //   return this._cachedUsers.get(userId) || undefined;
  // }
  getUser(userId: string): User {
    const item: string | null = localStorage.getItem(userId);
    if (item !== null) {
      const user:User = JSON.parse(item);
      return user;
    }
    return {
      userId: userId,
      username: userId
    };
  }

  getUserImage(userId: string): string {
    return this.getUser(userId)?.avatar || "https://api.dicebear.com/avatar.svg"; 
  }

  getUsername(userId: string): string {
    return this.getUser(userId)?.username || "noName"; 
  }


}

