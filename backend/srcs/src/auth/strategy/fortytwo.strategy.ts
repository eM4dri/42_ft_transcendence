import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  Profile,
  VerifyCallBack,
} from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
  Strategy,
  '42',
) {
  constructor(
    private readonly config: ConfigService,
  ) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret:
        process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL:
        process.env.FORTYTWO_CLIENT_URL_CALLBACK,
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallBack,
  ): Promise<any> {
    request.session.accessToken = accessToken;

    const user = {
      id42: profile.id,
      username42: profile.username,
      email42: profile.emails[0].value,
      url42: profile.profileUrl,
      provider: profile.provider,
    };

    return cb(null, user);
    // return user;
  }
}
