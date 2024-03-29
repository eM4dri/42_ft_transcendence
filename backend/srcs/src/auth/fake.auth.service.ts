import { Injectable } from '@nestjs/common';
import { JwtPayload } from './strategy';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { AuthService } from './auth.service';
import { UserConstants } from '../utils/user.constants';

@Injectable()
export class FakeAuthService {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  async fakeLogin(username: string) {
    let userdb: User = await this._getFakeUser(username);
    const payload: JwtPayload = {
      username: userdb.username,
      sub: userdb.userId,
      role: userdb.role,
    };
    return this.authService.getTokens(payload);
  }

  private async _getFakeUser(username: string): Promise<User> {
    const userEmail: string = `${username}@mail.com`;
    const usersId42: number[] = Array.from((await this.userService.all()).map(x => x.userId42));
    let min: number = 42;
    for (let userId42 of usersId42) {
      if (userId42 < min) {
        min = userId42;
      }
    }
    let userdb: User = await this.userService.getByEmail(userEmail);
    if (!userdb) {
      const fakeUsername = `${username}`;
      const newUser: CreateUserDto = {
        id: min - 1,
        username: fakeUsername,
        email: userEmail,
        url: `${UserConstants.INTRA_URL}/${fakeUsername}`,
        firstName: fakeUsername,
        lastName: fakeUsername,
        twofa: false,
      };
      userdb = await this.userService.new(
        newUser,
      );
    }
    return userdb;
  }

  async tfaNeeded(username: string): Promise<string>{
    const userEmail: string = `${username}@mail.com`;
    const user = await this.userService.getByEmail(userEmail);
    return user ? (
      user.twofa? user.userId : undefined
      ) : undefined;
  }

}
