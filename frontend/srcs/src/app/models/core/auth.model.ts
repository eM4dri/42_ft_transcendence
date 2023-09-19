export namespace AuthModel {
  export interface UserTokenData {
    iat:          number;
    exp:          number;
    username:     string;
    sub:          string;
  }

  export const userTokenData: UserTokenData = {
    sub: '',
    username: '',
    iat: 0,
    exp: 0
  }
}
