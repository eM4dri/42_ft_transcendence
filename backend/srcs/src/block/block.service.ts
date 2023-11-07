import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlockedList } from "@prisma/client";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// La tabla de SilenceList, así como la de banned, son simples y por tanto
// un dto es innecesario. de todas formas,
// TODO: comentarlo con el resto
@Injectable()
export class BlockService {
    constructor(private prisma: PrismaService) {}
    
    async getBlockedList(userId_blocker: string)
    : Promise< { userId_blocked : string }[]> {
        
        const response = await this.prisma.blockedList.findMany({
            where: {
                userId_blocker: userId_blocker
            },
            select: {
                userId_blocked: true
            }
        })

        return response;
    }

    async blockUser(userId_blocker: string, userId_blocked: string)
    : Promise <{ userId_blocker: String, userId_blocked: String }> {
        try {
            const response = await this.prisma.blockedList.create({
                data: {
                    userId_blocker: userId_blocker,
                    userId_blocked: userId_blocked
                }
            });
            return response;
        } catch (error) {
            // Podemos tener un error si el usuario vuelve a banear a alguien
            // que ya tiene silenciado. El cliente no deberia enterarse, pero es 
            // bueno responder que no se ha insertado nada porque el usuario
            // ya estaba silenciado.
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002') {
                    throw new HttpException(
                        'User already banned',
                        HttpStatus.CONFLICT,
                    );
                }
            }
            throw (error);
        }
    }

    async unblockUser(userId_blocker: string, userId_blocked: string)
    : Promise <{ userId_blocker: String, userId_blocked: String }> {
        try {
            const response = await this.prisma.blockedList.delete({
                where : {
                    block_pair : {
                        userId_blocker : userId_blocker,
                        userId_blocked : userId_blocked
                    }
                }
            })
            return response;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                  throw new HttpException(
                    'Silenced user not found',
                    HttpStatus.NOT_FOUND,);
                }
              }
              throw error;
        }
    }
}
