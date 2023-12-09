import { Injectable, UnauthorizedException, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BannedList } from "@prisma/client";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/auth/role.enum';


@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService
    ){}

    // Nada que no sea un User puede ser baneado.
    // Enlazado a que solo los Owners pueden promover/demotear al resto,
    // Se tiene que un Admin no puede banear a un Owner. Pero un Owner
    // puede banear al Admin haciendole demote + ban.
    // Esto se lo tiene que figure out el Owner, no es lógica que vayamos a añadir.
    async _targetUserHasUserRole(userId: string) : Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { userId },
          });
        return user.role === Role.User;
    }

    async allExtendedUsers() {
        const users = await this.prisma.user.findMany({
            select: {
              userId: true,
              username: true,
              avatar: true,
              role: true,
            }
          });
        const banlist = await this.prisma.bannedList.findMany();
        const result = users.map((user) => {
            // Me defino un booleano que indique si el userId está en la lista de baneados
            const isBanned : boolean = banlist.filter((banListEntry) => banListEntry.userId === user.userId).length !== 0
            // Y lo añado al cuerpo que ya tenemos de la respuesta de bd para conformar el ExtendedUser.
            return {
                userId: user.userId,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
                isBanned: isBanned
            }
        })
        return result;
    }


    async banUser(userId: string)
    : Promise <{userId: String }> {
        try {
            // Controlamos que solo se baneen Users
            if (await this._targetUserHasUserRole(userId) === false) {
                throw new ForbiddenException({ response : "Only users can be banned"});
            }
            const response = await this.prisma.bannedList.create({
                data: {
                    userId: userId
                }
            });
            return response;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002') {
                    throw new HttpException(
                        { response:'User already banned' },
                        HttpStatus.CONFLICT,
                    );
                }
            }
            throw (error);
        }
    }

    // Aqui no controlamos que se baneen en exclusiva users porque imaginate que te demoteo,
    // te baneo, y luego te promuevo a admin. Vuala nunca mas vas a ser desbaneado.
    async unBanUser(userId: string)
    : Promise <{userId: String }> {
        try {
            // Necesito el bannedListEntry para que esto tire
            const bannedListEntry = await this.prisma.bannedList.findFirst({
                where : { userId }
            })
            // Porque aqui no basta con pasarle el userId, se empeña en pedirme
            // el id de la columna. Que sí, que puede parecer que tenga sentido, pero
            // Es que está el campo userId marcado como unique, entonces no lo entiendo.
            const response = await this.prisma.bannedList.delete({
                where : { banListId : bannedListEntry.banListId }
            })
            return response;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                  throw new HttpException(
                    {response:  'User was not banned'},
                    HttpStatus.NOT_FOUND,);
                }
              }
              throw error;
        }
    }

    async promoteUser(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { userId },
            });
            let newRole = Role.Owner;
            if (user.role === Role.User) {
                newRole = Role.Admin;
            }
            const response = await this.prisma.user.update({
                where: {
                    userId : userId
                },
                data: {
                    role: newRole
                }
            });
            return response;
        } catch (error){
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                  throw new HttpException(
                    {response:  'User does not exist'},
                    HttpStatus.NOT_FOUND);
                }
            }
            throw error;
        }
    }

    async demoteUser(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { userId },
            });
            let newRole = Role.User;
            if (user.role === Role.Owner) {
                newRole = Role.Admin;
            }
            const response = await this.prisma.user.update({
                where: {
                    userId : userId
                },
                data: {
                    role: newRole
                }
            });
            return response;
        } catch (error){
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                  throw new HttpException(
                    {response:  'User does not exist'},
                    HttpStatus.NOT_FOUND);
                }
            }
            throw error;
        }
    }

}