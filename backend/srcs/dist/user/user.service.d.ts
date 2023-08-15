import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
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
    } | "New user">;
    update(): string;
    partialUpdate(): string;
    delete(): string;
}
