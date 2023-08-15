import { Injectable } from '@nestjs/common';
import { contains } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService){}

   async  getChats(userId: number){
        return await this.prisma.user.findMany({
            // include: {
            //     created: true,
            //     users: true,
            // }
            select: {
                email: true,
                createdAt: true,
                users1: {
                    where: {
                        id: userId
                    },
                }    
            },

        });
        // return await this.prisma.chatUser.findMany({

        //     // select: {
        //     //     users: {
        //             where: {
        //                 userId: userId
        //             },
        //     //     }    
        //     // },
        // });
        // const chats = await this.prisma.chatUser.findMany({
        //     where:{
        //         userId
        //     }
        // });
        // const chatIds = []; 
        // chats.forEach( function (index) {
        //     chatIds.push(index.chatId);
        // });
        // const chatUsers = await this.prisma.chatUser.findMany({
        //     where:{
        //         chatId : { in: chatIds }  
        //     }
        // });

        // const userIds = [];
        // chatUsers.forEach( function (index) {
        //     userIds.push(index.userId);
        // });
        
        // const users = await this.prisma.user.findMany({
        //     where: {
        //        id: { in: userIds  },
        //     },
        //     select: {
        //         id: true,
        //         created: true,
        //         users: true
        //     },
        // });

        // return this.prisma.chat.findMany({
        //     where: {
        //        id: { in: chatIds  },
        //     },
        //     select: {
        //         id: true,
        //         created: true,
        //         users: true
        //     },
        // });
    }
}
