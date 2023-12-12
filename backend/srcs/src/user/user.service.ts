import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto, ResponseUserMinDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Role } from "../auth/role.enum";
import { AvatarConstants } from "src/utils/avatar.contants";
import { PatchUserDto } from "./dto/patchUser.dto";
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new HttpException({ response:'User not found' },
        HttpStatus.NOT_FOUND,
      )
    }
    return user;
  }

  all() {
    return this.prisma.user.findMany();
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  getUsers(userIds: string[]) {
    return this.prisma.user.findMany({
      where: {
        userId: { in: userIds },
      },
    });
  }

  async getUsersMin(userIds: string[]): Promise<ResponseUserMinDto[]> {
    return await plainToInstance(ResponseUserMinDto, 
      await this.prisma.user.findMany({
              where: {
                userId: { in: userIds },
              },
            })
      );
  }

  async new(dto: CreateUserDto) {
    // save the new user in the db
    const owner_users: string[] = [
      "emadriga",
      "tomartin",
      "carce-bo",
      "jvacaris",
      "pmedina-",
    ];
    let User_Role: Role;

    if (owner_users.includes(dto.username)) {
      User_Role = Role.Owner;
    }
    try {
      const user = await this.prisma.user.create({
        data: {
          userId42: dto.id,
          username: dto.username,
          login: dto.username,
          url: dto.url,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: User_Role,
          twofa: dto.twofa,
          twofa_code: "",
          stats_user: {
            create: {},
          },
          avatar: `${AvatarConstants.USER}${dto.username}`
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === "P2002") {
          throw new HttpException(
            "User already in use",
            HttpStatus.CONFLICT,
          );
        }
      }
      throw error;
    }
  }

  async update(userId: string, dto: PatchUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          userId: userId
        },
        data: {
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          twofa: dto.twofa,
          twofa_code: dto.twofa_code
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof
          PrismaClientKnownRequestError
      ) {
        if (error.code === "P2002") {
          throw new HttpException(
            {response:  'Username already in use'},
            HttpStatus.CONFLICT,
          );
        } else if (error.code === "P2025") {
          throw new HttpException(
            {response:  'User not found'},
            HttpStatus.CONFLICT,
          );
        }
      }
      throw error;
    }
  }

  delete() {
    return "Delete user!";
  }
}
