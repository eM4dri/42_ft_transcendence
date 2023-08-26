import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  Profile,
  VerifyCallBack,
} from 'passport-42';
import { UserService } from '../../user/user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
  Strategy,
  '42',
) {
  constructor(
    private userService: UserService,
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
    // const user42 = {
    //   id: profile.id,
    //   username: profile.username,
    //   email: profile.emails[0].value,
    //   url: profile.profileUrl,
    //   provider: profile.provider,
    // };
    // console.log(user42);
    const userEmail = profile.emails[0].value;
    let userdb : User = await this.userService.get(
      userEmail,
    );
    if (!userdb) {
      const id: number = +profile.id;
      const newUser: CreateUserDto = {
        id: id,
        username: profile.username,
        email: userEmail,
        url: profile.profileUrl,
        firstName: profile.name.givenName,
        lastName:
          profile.name.familyName.split(' ')[0],
      };
      userdb = await this.userService.new(
        newUser,
      );
    }
    console.log(userdb);
    return cb(null, userdb);
  }
}
