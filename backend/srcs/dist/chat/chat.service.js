"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = exports.ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getChats(userId) {
        const chats = await this.prisma.chatUser.findMany({
            where: {
                userId,
            },
        });
        const chatIds = [];
        chats.forEach(function (index) {
            chatIds.push(index.chatId);
        });
        const chatUsers = await this.prisma.chatUser.findMany({
            where: {
                chatId: { in: chatIds },
                NOT: { userId: userId },
            },
        });
        const usersIds = [];
        chatUsers.forEach(function (index) {
            usersIds.push(index.userId);
        });
        const emailUsers = await this.prisma.user.findMany({
            where: {
                id: { in: usersIds },
            },
        });
        const result = chatUsers.map((chatUser) => {
            const userMails = emailUsers.filter((email) => email.id == chatUser.userId)[0];
            return {
                chatId: chatUser.chatId,
                userId: chatUser.userId,
                uersEmail: userMails ? userMails['email'] : null,
            };
        });
        return result;
    }
    async new(dto) {
        try {
            const chat = await this.prisma.chat.create({
                data: {
                    chatusers: {
                        create: [{ userId: dto.user1 }, { userId: dto.user2 }],
                    },
                },
            });
            return chat;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map