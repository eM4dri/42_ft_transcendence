import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto';
import { AuthService } from './auth.service';

@Injectable()
export class FakeAuthService {
  constructor(
    private jwtService: JwtService,
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
    let userdb: User = await this.userService.get(
      userEmail,
    );
    if (!userdb) {
      const fakeUsername = `fake_${username}`;
      const newUser: CreateUserDto = {
        id: min - 1,
        username: fakeUsername,
        email: userEmail,
        url: `https://profile.intra.42.fr/users/${fakeUsername}`,
        firstName: fakeUsername,
        lastName: fakeUsername,
      };
      userdb = await this.userService.new(
        newUser,
      );
    }
    return userdb;
  }
}
