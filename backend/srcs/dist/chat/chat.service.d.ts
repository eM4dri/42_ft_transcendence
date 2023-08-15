import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getChats(userId: number): Promise<{
        email: string;
        createdAt: Date;
        users1: {
            id: number;
            created: Date;
            user1: number;
            user2: number;
        }[];
    }[]>;
}
