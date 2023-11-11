export namespace AuthModel {
  export interface UserTokenData {
    iat:          number;
    exp:          number;
    role:         string;
    username:     string;
    sub:          string;
  }

  export const userTokenData: UserTokenData = {
    sub: '',
    username: '',
    role: '',
    iat: 0,
    exp: 0
  }
}
