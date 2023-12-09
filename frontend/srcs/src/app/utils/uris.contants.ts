import { isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';

// const host = isDevMode() ? 'http://localhost:5000' : 'otherdomain.com';
const apiVersion = '';
// const apiVersion = '/api/v1';
const apiBasePath = environment.apiUrl + apiVersion;
const staticImgBase = environment.staticImagesUrl + '/static_images';
export class UriConstants {
  public static readonly AUTH_REFRESH = apiBasePath + '/refresh';
  public static readonly AUTH_PING = apiBasePath + '/ping';
  public static readonly USERS = apiBasePath + '/user';
  public static readonly USER_FRIENDS = apiBasePath + '/userFriends';
  public static readonly CHAT = apiBasePath + '/chat';
  public static readonly MESSAGE = apiBasePath + '/chat/message';
  public static readonly CHANNEL = apiBasePath + '/channel';
  public static readonly MANAGE_CHANNELS = apiBasePath + '/channel/admin';
  public static readonly PROFILE_IMAGES_USERS = apiBasePath + '/profile-images/users';
  public static readonly PROFILE_IMAGES_CHANNELS = apiBasePath + '/profile-images/channels';
  public static readonly USER_STATS = apiBasePath + '/stats';
  public static readonly RAMDON_AVATAR_URL = 'https://api.dicebear.com/7.x/';
  public static readonly RAMDON_AVATAR_PATH = '/svg?seed=';
  public static readonly USER_AVATAR_DEFAULT = staticImgBase + '/user/default.svg';
  public static readonly CHANNEL_AVATAR_DEFAULT = staticImgBase + '/channel/default.svg';
  public static readonly TFA = apiBasePath + '/tfa/qrcode';
  public static readonly VALID_TFA = apiBasePath + '/login/tfa/validate';
  public static readonly BLOCK = apiBasePath + '/block';
  public static readonly ADMIN_MANAGE_CHANNELS = apiBasePath + '/admin/channel';
  public static readonly ADMIN_MANAGE_USERS = apiBasePath + '/admin';
  public static readonly CHALLENGE = apiBasePath + '/challenge';
  public static readonly HISTORIC = apiBasePath + '/historic-games'
  public static readonly RANK = apiBasePath + '/stats/rank'
}
