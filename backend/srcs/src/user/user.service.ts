import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Http2ServerResponse } from 'http2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService)  {

  }
  // test() {}
  all() {
    return this.prisma.user.findMany();
  }

   get(email: string) {
    return  this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
  }

  async new(dto: CreateUserDto) {
    console.log( dto.firstName ) ;
    // save the new user in the db 
    try{
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName
        },   
      });
      return user;
    }    catch (error) {
      if (error instanceof PrismaClientKnownRequestError){
        if (error.code === 'P2002'){
          throw new HttpException('Email already in use', HttpStatus.CONFLICT);
        }
      }
        throw error;
    }
    return 'New user';
  }

  update() {
    return 'Update user!';
  }

  partialUpdate() {
    return 'Update user partially!';
  }
  
  delete() {
    return 'Delete user!';
  }
}
