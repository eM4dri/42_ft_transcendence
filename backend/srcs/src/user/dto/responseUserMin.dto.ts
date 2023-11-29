import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ResponseUserMinDto implements User {
  userId: string;
  username: string;
  avatar: string;

  @Exclude()
  createdAt: Date;
  @Exclude()
  password: string;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  userId42: number;
  @Exclude()
  login: string;
  @Exclude()
  email: string;
  @Exclude()
  url: string;
  @Exclude()
  firstName: string;
  @Exclude()
  lastName: string;
  @Exclude()
  twofa: boolean;
  @Exclude()
  twofa_code: string;
  @Exclude()
  role: $Enums.Role;
}
