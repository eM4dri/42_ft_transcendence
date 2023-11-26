import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


@Injectable()
export class UserFriendsService {
  constructor(private prisma: PrismaService) { }

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
              'Friend relation already exists',
              HttpStatus.CONFLICT,
            );
          }
      }
      throw (error);
    }
  }

  async deleteFriend(uuid: string, friendUuid: string) {
    try {
      await this.prisma.friendsList.deleteMany({
        where: {
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
            'Friend relation doesnt exist',
            HttpStatus.CONFLICT,
          );
        }
    }
    throw (error);
    }
  }
}
