import { Injectable } from '@angular/core';
import { User } from '../models';
import { UserService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class UsersCache {
  private _myUserId = '';
  private _conectedUsers = new Set<string>();
  private _cachedUsers = new Map<string, User>();

  constructor(
    private readonly userService: UserService,
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
    if (this._cachedUsers.has(user.userId) === false) {
      this._cachedUsers.set(user.userId, user);
    }
  }

  getConnectedUsers(){
    return this._conectedUsers;
  }
  isUserConnected(userId:string): boolean {
    return this._conectedUsers.has(userId)
  }

  getUsername(userId: string): string {
    return this._cachedUsers.get(userId)?.username || "noName"; 
  }

  getUser(userId: string): User | undefined {
      return this._cachedUsers.get(userId) || undefined;
  }

  getUserImage(userId: string): string {
    return this._cachedUsers.get(userId)?.avatar || "https://api.dicebear.com/avatar.svg"; 
  }

  setMyUserId(userId: string){
    this._myUserId = userId;
  }

  getMyUserId():string {
    return this._myUserId;
  }

}

