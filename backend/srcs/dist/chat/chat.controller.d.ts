import { ChatService } from './chat.service';
import { CreateChatDto } from './dto';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
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
