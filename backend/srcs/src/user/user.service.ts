import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Role } from "../auth/role.enum";
import { AvatarConstants } from "src/utils/avatar.contants";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  all() {
    return this.prisma.user.findMany();
  }

  get(email: string) {
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

  update() {
    return "Update user!";
  }

  partialUpdate() {
    return "Update user partially!";
  }

  delete() {
    return "Delete user!";
  }
}
