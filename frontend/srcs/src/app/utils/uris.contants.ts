import { isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';

// const host = isDevMode() ? 'http://localhost:5000' : 'otherdomain.com';
const apiVersion = '';
// const apiVersion = '/api/v1';
const apiBasePath = environment.apiUrl + apiVersion;
const staticImgBase = environment.staticImagesUrl + '/static_images';
export class UriConstants {
  public static readonly AUTH_REFRESH = apiBasePath + '/refresh';
  // public static readonly AUTH_REFRESH = basePath + '/auth/refresh';
  public static readonly USERS = apiBasePath + '/user';
  public static readonly CHAT = apiBasePath + '/chat';
  public static readonly MESSAGES = apiBasePath + '/chat/message';
  public static readonly CHANNELS = apiBasePath + '/channel';
  public static readonly MANAGE_CHANNELS = apiBasePath + '/channel/admin';
  public static readonly RAMDON_AVATAR = 'https://api.dicebear.com/7.x/bottts/svg?seed=';
  public static readonly USER_AVATAR_DEFAULT = staticImgBase + '/user/default.svg';
  public static readonly CHANNEL_AVATAR_DEFAULT = staticImgBase + '/channel/default.svg';

}
