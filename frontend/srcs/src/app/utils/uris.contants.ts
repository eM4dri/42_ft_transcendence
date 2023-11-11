import { isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';

// const host = isDevMode() ? 'http://localhost:5000' : 'otherdomain.com';
const apiVersion = '';
// const apiVersion = '/api/v1';
const basePath = environment.apiUrl + apiVersion;
export class UriConstants {
  public static readonly AUTH_REFRESH = basePath + '/refresh';
  // public static readonly AUTH_REFRESH = basePath + '/auth/refresh';
  public static readonly USERS = basePath + '/user';
  public static readonly CHAT = basePath + '/chat';
  public static readonly MESSAGES = basePath + '/chat/message';
  public static readonly CHANNELS = basePath + '/channel';
  public static readonly MANAGE_CHANNELS = basePath + '/channel/admin';
  public static readonly RAMDON_AVATAR = 'https://api.dicebear.com/7.x/bottts/svg?seed=';

}
