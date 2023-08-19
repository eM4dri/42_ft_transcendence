import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChats(userId: string) {
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
  async new(dto: CreateChatDto) {
    try {
      const chat = await this.prisma.chat.create({
        data: {
          chatusers: {
            create: [{ userId: dto.user1 }, { userId: dto.user2 }],
          },
        },
      });
      return chat;
    } catch (error) {
      //handle errors if needed
      throw error;
    }
  }
}
