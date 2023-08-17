import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getChats(userId: number): Promise<{
        chatId: number;
        userId: number;
        uersEmail: string;
    }[]>;
    new(dto: CreateChatDto): Promise<{
        id: number;
        created: Date;
    }>;
}
