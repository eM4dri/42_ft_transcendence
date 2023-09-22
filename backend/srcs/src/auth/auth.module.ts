import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  FortyTwoStrategy,
  JwtStrategy,
} from './strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { FakeAuthService } from './fake.auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FortyTwoStrategy,
    JwtStrategy,
    UserService,
    FakeAuthService
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
