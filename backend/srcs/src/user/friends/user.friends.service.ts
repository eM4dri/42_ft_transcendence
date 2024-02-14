import { HttpException, HttpStatus, Response, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


@Injectable()
export class UserFriendsService {
  constructor(
    private prisma: PrismaService
    ) { }
  async getFriendList(userId: string) {
      const response = await this.prisma.friendsList.findMany({
          where: {
            userId_adding: userId
          },
          select: {
              userId_added: true
          }
      });
      return response.map((item) => item.userId_added);
  }

  getByUserId(userId: string) {
    return this.prisma.friendsList.findMany({
      select: {
        FriendListId: true,
        userId_added: true
      },
      where: {
        userId_adding: userId
      },
    });
  }

  getFriendById(userId: string, friendUuid: string) {
    return this.prisma.friendsList.findFirst({
      select: {
        userId_added: true
      },
      where: {
        userId_adding: userId,
        userId_added:  friendUuid
      },
    });
  }

  async newFriend(uuid: string, friendUuid: string) {
    // save the new friend in the db
    try {
      // if (uuid === friendUuid) {
      //   throw new HttpException({ response: 'You can\'t be your own friend!' }, HttpStatus.BAD_REQUEST)
      // }
      await this.prisma.friendsList.create({
          data: {
            userId_adding: uuid,
            userId_added: friendUuid,
          },
      });
    } catch (error) {
      if (
          error instanceof
          PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new HttpException(
              {response:  'Friend relation already exists'},
              HttpStatus.BAD_REQUEST,
            );
          } else if (error.code === 'P2003') {
            throw new HttpException(
              {response:  'User not found'},
              HttpStatus.NOT_FOUND,
            );
          }
      }
      throw (error);
    }
  }

  async deleteFriend(uuid: string, friendUuid: string) {
    try {
    await this.prisma.friendsList.delete({
      where : {
        friend_pair : {
          userId_adding: uuid,
          userId_added: friendUuid,
        }
      }
    });
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2025') {
          throw new HttpException(
            {response:  'User not found in friends list'},
            HttpStatus.NOT_FOUND,
          );
        }
    }
    throw (error);
    }
  }
}
