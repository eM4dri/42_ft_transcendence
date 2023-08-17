import { UserService } from './user.service';
import { CreateUserDto } from './dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    all(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
    }[]>;
    get(email: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    new(dto: CreateUserDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
    }>;
}
