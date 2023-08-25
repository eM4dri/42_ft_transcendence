import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  FortyTwoStrategy,
  JwtStrategy,
} from './strategy';
import { AuthController } from './auth.controller';

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
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
