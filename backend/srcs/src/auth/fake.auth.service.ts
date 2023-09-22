import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto';

@Injectable()
export class FakeAuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    ) {}

  async fakeLogin() {
    let userdb: User = await this._getFakeUser();
    const payload: JwtPayload = {
      username: userdb.username,
      sub: userdb.userId,      
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async _getFakeUser(): Promise<User> {
    const userEmail: string = 'gisasa-3@student.42madrid.com';
    let userdb: User = await this.userService.get(
      userEmail,
    );
    if (!userdb) {
      const newUser: CreateUserDto = {
        id: 3,
        username: 'gisasa-3',
        email: userEmail,
        url: 'https://profile.intra.42.fr/users/gisasa-3',
        firstName: 'gisasa-3',
        lastName:'gisasa-3',
      };
      userdb = await this.userService.new(
        newUser,
      );
    }
    return userdb;
  }
}
