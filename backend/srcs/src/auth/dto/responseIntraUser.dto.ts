import { Role, User} from '@prisma/client';
import { Exclude } from 'class-transformer';
 
export class ResponseIntraUserDto implements User {
    userId: string;
    username: string;
    role: Role;
    isNew: boolean;

    @Exclude()
    userId42: number;
    @Exclude()
    email:string;
    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date;
    @Exclude()
    login: string;
    @Exclude()
    url: string;
    @Exclude()
    firstName: string;
    @Exclude()
    lastName: string;
    @Exclude()
    avatar: string;
    @Exclude()
    twofa: boolean;
    @Exclude()
    twofa_code: string;
}

