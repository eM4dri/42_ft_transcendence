import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
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
