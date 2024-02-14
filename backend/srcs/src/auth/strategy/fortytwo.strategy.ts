import { ConflictException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  Profile,
  VerifyCallBack,
} from 'passport-42';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dto/createUser.dto';
import { ResponseIntraUserDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { UserConstants } from '../../utils/user.constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
  Strategy,
  '42',
) {
  constructor(private userService: UserService) {
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
    try {
      request.session.accessToken = accessToken;
      const userEmail = profile.emails[0].value;
      let userdb: ResponseIntraUserDto = plainToInstance(ResponseIntraUserDto,await this.userService.getByEmail(
        userEmail,
      ));
      if (!userdb) {
        const id: number = +profile.id;
        const newUser: CreateUserDto = {
          id: id,
          username: profile.username,
          email: userEmail,
          url: `${UserConstants.INTRA_URL}/${profile.username}`,
          firstName: profile.name.givenName,
          lastName:
            profile.name.familyName.split(' ')[0],
          twofa: false,
        };
        userdb = plainToInstance(ResponseIntraUserDto, await this.userService.new(
          newUser,
        ));
        userdb.isNew = true;
      }
      return cb(null, userdb);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
            throw new ConflictException(
                { response:'Username already in use' },
            );
        }
    }
    throw (error);
  }
  }
}
