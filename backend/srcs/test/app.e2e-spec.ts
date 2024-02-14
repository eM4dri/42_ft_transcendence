import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateUserDto, PatchUserDto } from "src/user/dto";
import { CreateChatMessageDto } from "src/chat/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: string = 'login';
    describe('FakeLogin', () => {
      it('Should signUp new fake user',() => {
        return pactum
          .spec()
          .get(`${process.env.FAKE_LOGIN_URL}/${dto}`)
          .expectStatus(302)
          .expectHeader('set-cookie', /USER_TOKEN/)
          .expectHeader('set-cookie', /REFRESH_TOKEN/)
      });
      it('Should login returned fake user',() => {
        return pactum
          .spec()
          .get(`${process.env.FAKE_LOGIN_URL}/${dto}`)
          .expectStatus(302)
          .expectHeader('set-cookie', /USER_TOKEN/)
          .expectHeader('set-cookie', /REFRESH_TOKEN/)
          // .inspect()
          .stores((request, response) => {
            const cookies = response.headers['set-cookie'];
            const userToken = cookies.find((cookie: string) => cookie.includes('USER_TOKEN'));
            const accessToken = userToken.split(';')[0].split('=')[1];
            return {
               accessToken,
            };
          });
      });
    });
  });

  describe('User', () => {
    const dto: CreateUserDto = {
      id: 42,
      email: 'marvin@gmail.com',
      username: 'marvin',
      url: 'https://profile.intra.42.fr/users/marvin',
      twofa: false,
    };
    
    describe('Get me', () => {
      it('Should get current user',() => {
        return pactum
          .spec()
          .get(`/user/myUser`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .stores('myUserId','userId')
          .expectStatus(200)
          .expect(ctx => {
            expect(ctx.res.json).toHaveProperty('username','login');
            expect(ctx.res.json).toHaveProperty('email','login@mail.com');
          });
      });
    })
    describe('Create user', () => {
      it('Should be created',() => {
        return pactum
          .spec()
          .post(`/user`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .stores('userId','userId')
          .expectStatus(201)          
          .expect(ctx => {
            expect(ctx.res.json).toHaveProperty('username', dto.username);
            expect(ctx.res.json).toHaveProperty('email', dto.email);
            expect(ctx.res.json).toHaveProperty('url', dto.url);
          });
      });
      it('Shouldn\'t be created conflict',() => {
        return pactum
          .spec()
          .post(`/user`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .expectStatus(409)
          ;
      });
    });
    describe('Get Users', () => {
      it('Should get created user and my user',() => {
        return pactum
          .spec()
          .get(`/user/all`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expect(ctx => {
            expect(ctx.res.json[0]).toHaveProperty('username','login');
            expect(ctx.res.json[0]).toHaveProperty('email','login@mail.com');
            expect(ctx.res.json[1]).toHaveProperty('username', dto.username);
            expect(ctx.res.json[1]).toHaveProperty('email', dto.email);
            expect(ctx.res.json[1]).toHaveProperty('url', dto.url);
          });
      });
    });
    describe('Get user', () => { 
      it('Should get created user ', () => {
        return pactum
        .spec()
        .get(`/user/$S{userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .expectStatus(200)
        .expect(ctx => {
          expect(ctx.res.json).toHaveProperty('username', dto.username);
          expect(ctx.res.json).toHaveProperty('email', dto.email);
          expect(ctx.res.json).toHaveProperty('url', dto.url);
        });
      });
      it('Should get invalid uuid request Bad Request ', () => {
        const userId = 'invalid';
        return pactum
        .spec()
        .get(`/user/${userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .expectStatus(400)
      });
      it('Should get invalid Not found ', () => {
        const userId: string = '00000000-0000-0000-0000-000000000000';
        return pactum
        .spec()
        .get(`/user/${userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .expectStatus(404)
      });
    });
    describe('Edit user', () => {
      it('Should be edited', () => {
        const patchDto =  {
          username: "edited",
          firstName: "Marvin",
          lastName: "Gaye",
        };
        return pactum
        .spec()
        .patch(`/user/$S{userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .withBody(patchDto)
        .expectStatus(200)
        .expect(ctx => {
          expect(ctx.res.json).toHaveProperty('email', dto.email);
          expect(ctx.res.json).toHaveProperty('url', dto.url);
          expect(ctx.res.json).toHaveProperty('username', patchDto.username);
          expect(ctx.res.json).toHaveProperty('firstName', patchDto.firstName);
          expect(ctx.res.json).toHaveProperty('lastName', patchDto.lastName);
        });
      });
      it('Should not be edited username max length bad request', () => {
        return pactum
        .spec()
        .patch(`/user/$S{userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .withBody({username: "longusername"})
        .expectStatus(400)
      });
      it('Should not be edited firstName max length bad request', () => {
        return pactum
        .spec()
        .patch(`/user/$S{userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .withBody({firstName: "InvalidfirstName"})
        .expectStatus(400)
      });
      it('Should not be edited lastName max length bad request', () => {
        return pactum
        .spec()
        .patch(`/user/$S{userId}`)
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}'
        })
        .withBody({lastName: "InvalidfirstName"})
        .expectStatus(400)
      });
    });

  });

  describe('Chat', () => {

    const chatMessageDto = {
      listenerId: '$S{userId}',
      message: "Hi! this is the FIRST message",
    };
    let chatId: string;
    let chatMessageId: string;
    let chatMessage2Id: string;
    describe('Post chat message', () => {
      it('Should be created new chat with a message',() => {
        return pactum
          .spec()
          .post(`/chat/message`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(chatMessageDto)
          .stores('chatId','response.chatId')
          .stores('chatMessageId','chatMessageId')
          .expectStatus(201)          
          .expect(ctx => {
            expect(ctx.res.json).toHaveProperty('response.message.message', chatMessageDto.message);
          });
      });
      chatId = '$S{chatId}';
      chatMessageId = '$S{chatMessageId}';
      it('Should be created a new message in previous chat',() => {
        return pactum
          .spec()
          .post(`/chat/message`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody({
            ...chatMessageDto,
            chatId
          })
          .stores('chatMessage2Id','chatMessageId')
          .expectStatus(201)
          .expectJsonLike('response.chatId', chatId)
          .expectJsonLike('response.message.message', chatMessageDto.message);
      });
      chatMessage2Id = '$S{chatMessage2Id}';
      it('Shouldn\'t be created a new message unkown chatId',() => {
        return pactum
          .spec()
          .post(`/chat/message`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody({
            ...chatMessageDto,
            chatId: '00000000-0000-0000-0000-000000000000'
          })
          .expectStatus(404);
      });
    });
    describe('Get chats', () => {
      it('Should get all chats',() => {
        return pactum
          .spec()
          .get(`/chat`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expectJsonLike('[0].chatId', chatId)
          .expectJsonLike('[0].userId', chatMessageDto.listenerId);
        });
    });
    describe('Get chat', () => {
      it('Should get all chats',() => {
        return pactum
          .spec()
          .get(`/chat/${chatId}`)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expectJsonLike('[0].message', chatMessageDto.message)
          .expectJsonLike('[1].message', chatMessageDto.message)
          .expectJsonLike('[0].chatId', chatId)
          .expectJsonLike('[1].chatId', chatId)
        });
    });
    describe('Edit chat message', () => {
      // it('Should be created new chat with a message',() => {
      //   return pactum
      //     .spec()
      //     .put(`/chat/message`)
      //     .withHeaders({
      //       Authorization: 'Bearer $S{accessToken}'
      //     })
      //     .withBody({
      //       chatMessageId,
      //       message: "Hi! this is the FIRST message edited",
      //     })
      //     .expectStatus(201)          
      //     .expect(ctx => {
      //       expect(ctx.res.json).toHaveProperty('response.message.message', chatMessageDto.message);
      //     });
      // });
      // it('Should be created a new message in previous chat',() => {
      //   return pactum
      //     .spec()
      //     .put(`/chat/message`)
      //     .withHeaders({
      //       Authorization: 'Bearer $S{accessToken}'
      //     })
      //     .withBody({
      //       chatMessageId: chatMessage2Id,
      //       message: "Hi! this is the SECOND message edited",
      //     })
      //     .stores('chatMessage2Id','chatMessageId')
      //     .expectStatus(201)
      //     .expectJsonLike('response.chatId', chatId)
      //     .expectJsonLike('response.message.message', chatMessageDto.message);
      // });
      // it('Shouldn\'t be created a new message unkown chatId',() => {
      //   return pactum
      //     .spec()
      //     .put(`/chat/message`)
      //     .withHeaders({
      //       Authorization: 'Bearer $S{accessToken}'
      //     })
      //     .withBody({
      //       ...chatMessageDto,
      //       chatId: '00000000-0000-0000-0000-000000000000'
      //     })
      //     .expectStatus(404);
      // });
    });
    describe('Delete chat message', () => {});
   });

});