import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateChatMessageDto,
  UpdateChatMessageDto,
} from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChatUsers(chatId: string){
    return await this.prisma.chatUser.findMany({
      where: {  chatId   },
    });
  }

  async getChats(userId: string) {
    const chats =
      await this.prisma.chatUser.findMany({
        where: { userId },
      });
    const chatIds = [];
    chats.forEach(function (index) {
      chatIds.push(index.chatId);
    });
    const chatUsers =
      await this.prisma.chatUser.findMany({
        where: {
          AND: {
            chatId: { in: chatIds },
            userId: { not: userId },
          },
        },
      });
    const usersIds = [];
    chatUsers.forEach(function (index) {
      usersIds.push(index.userId);
    });
    const emailUsers =
      await this.prisma.user.findMany({
        where: {
          userId: { in: usersIds },
        },
      });
    const result = chatUsers.map((chatUser) => {
      const userMails = emailUsers.filter(
        (emailUser) =>
          emailUser.userId == chatUser.userId,
      )[0];
      return {
        chatId: chatUser.chatId,
        userId: chatUser.userId,
        chatUserId: chatUser.chatUserId,
        userEmail: userMails.email,
      };
    });
    return result;
  }

  async getChatMessages(chatId: string) {
    const chatUsers =
      await this.prisma.chatUser.findMany({
        where: { chatId },
      });
    const chatUsersIds = [];
    chatUsers.forEach(function (index) {
      chatUsersIds.push(index.chatUserId);
    });
    const messages =
      await this.prisma.chatUserMessage.findMany({
        where: {
          chatUserId: { in: chatUsersIds },
        },
      });
    const usersIds = [];
    chatUsers.forEach(function (index) {
      usersIds.push(index.userId);
    });
    const usersData =
      await this.prisma.user.findMany({
        where: {
          userId: { in: usersIds },
        },
      });

    const chat = messages.map((msg) => {
      const currentUserId = chatUsers.filter(
        (chatUser) =>
          chatUser.chatUserId == msg.chatUserId,
      )[0].userId;
      const currentUser = usersData.filter(
        (userData) =>
          userData.userId == currentUserId,
      )[0];
      return {
        chatId: chatId,
        userId: currentUserId,
        email: currentUser.email,
        createdAt: msg.createdAt,
        updatedAt:
          msg.updatedAt.getTime() !=
          msg.createdAt.getTime()
            ? msg.updatedAt
            : null,
        message: msg.message,
      };
    });
    return chat;
  }

  async getChatMessagesLighter(chatId: string) {
    const chatUsers =
      await this.prisma.chatUser.findMany({
        where: { chatId },
      });
    const chatUsersIds = [];
    chatUsers.forEach(function (index) {
      chatUsersIds.push(index.chatUserId);
    });
    const messages =
      await this.prisma.chatUserMessage.findMany({
        where: {
          chatUserId: { in: chatUsersIds },
        },
      });
    return messages;
  }


  async newChatMessage(
    talker: string,
    dto: CreateChatMessageDto,
  ) {
    try {
      let chatId = dto.chatId
        ? dto.chatId
        : await this.getCurrentChatId(
            talker,
            dto.listenerId,
          );
      if (chatId === null) {
        chatId = (
          await this.newChat(
            talker,
            dto.listenerId,
          )
        ).chatId;
      }
      const currentChat =
        await this.prisma.chatUser.findFirst({
          where: {
            AND: {
              userId: talker,
              chatId: await chatId,
            },
          },
        });
      const msg =
        await this.prisma.chatUserMessage.create({
          data: {
            chatUserId: currentChat.chatUserId,
            message: dto.message,
          },
        });
      return msg;
    } catch (error) {
      //handle errors if needed
      throw error;
    }
  }

  async updateChatMessage(
    dto: UpdateChatMessageDto,
  ) {
    try {
      const message =
        await this.prisma.chatUserMessage.update({
          where: {
            chatMessageId: dto.chatMessageId,
          },
          data: { message: dto.message },
        });
      return message;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2025') {
          throw new HttpException(
            'An operation failed because it depends on one or more records that were required but not found. {cause}',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw error;
    }
  }

  async deleteChatMessage(chatMessageId: string) {
    try {
      const message =
        await this.prisma.chatUserMessage.delete({
          where: { chatMessageId },
        });
      return message;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2025') {
          throw new HttpException(
            'An operation failed because it depends on one or more records that were required but not found. {cause}',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw error;
    }
  }

  private async newChat(
    talker: string,
    listener: string,
  ) {
    try {
      const chat = await this.prisma.chat.create({
        data: {
          chatUsers: {
            create: [
              { userId: talker },
              { userId: listener },
            ],
          },
        },
      });
      return chat;
    } catch (error) {
      //handle errors if needed
      throw error;
    }
  }

  private async getCurrentChatId(
    talker: string,
    listener: string,
  ) {
    const talkerChats =
      await this.prisma.chatUser.findMany({
        where: { userId: talker },
      });
    const talkerChatIds = [];
    talkerChats.forEach(function (index) {
      talkerChatIds.push(index.chatId);
    });
    const listenerChat =
      await this.prisma.chatUser.findFirst({
        where: {
          AND: {
            userId: listener,
            chatId: { in: talkerChatIds },
          },
        },
      });
    const chatId = listenerChat
      ? listenerChat.chatId
      : null;
    return chatId;
  }
}
