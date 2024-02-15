import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateUserDto } from "src/user/dto";


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
    await app.listen(process.env.API_PORT);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(process.env.API_URL);
  });
  afterAll(() => {
    app.close();
  });
  const unkownUUID: string = '00000000-0000-0000-0000-000000000000';
  const authHeader = {
    Authorization : 'Bearer $S{accessToken}'
  } 
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
          .withHeaders({...authHeader})
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
          .withHeaders({...authHeader})
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
          .withHeaders({...authHeader})
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
          .withHeaders({...authHeader})
          .expectStatus(200)
          .expect(ctx => {
            expect(ctx.res.json).toHaveProperty('response[0].username','login');
            expect(ctx.res.json).toHaveProperty('response[0].email','login@mail.com');
            expect(ctx.res.json).toHaveProperty('response[1].username', dto.username);
            expect(ctx.res.json).toHaveProperty('response[1].email', dto.email);
            expect(ctx.res.json).toHaveProperty('response[1].url', dto.url);
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
        return pactum
        .spec()
        .get(`/user/${unkownUUID}`)
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
    const chatId: string= '$S{chatId}';
    const editMessage1Dto = {
      chatMessageId: '$S{chatMessage1Id}',
      message: "Hi! this is the FIRST message edited",
    }
    const editMessage2Dto = {
      chatMessageId: '$S{chatMessage2Id}',
      message: "Hi! this is the SECOND message edited",
    }
    describe('Post chat message', () => {
      it('Should be created new chat with a message',() => {
        return pactum
          .spec()
          .post(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody(chatMessageDto)
          .stores('chatId','response.chatId')
          .stores('chatMessage1Id','response.message.chatMessageId')
          .expectStatus(201)          
          .expect(ctx => {
            expect(ctx.res.json).toHaveProperty('response.message.message', chatMessageDto.message);
          });
      });
      it('Should be created a new message in previous chat',() => {
        return pactum
          .spec()
          .post(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody({
            ...chatMessageDto,
            chatId
          })
          .stores('chatMessage2Id','response.message.chatMessageId')
          .expectStatus(201)
          .expectJsonLike('response.chatId', chatId)
          .expectJsonLike('response.message.message', chatMessageDto.message);
      });
      it('Shouldn\'t be created a new message unkown chatId',() => {
        return pactum
          .spec()
          .post(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody({
            ...chatMessageDto,
            chatId: unkownUUID
          })
          .expectStatus(404);
      });
    });
    describe('Get chats', () => {
      it('Should get all chats',() => {
        return pactum
          .spec()
          .get(`/chat`)
          .withHeaders({...authHeader})
          .expectStatus(200)
          .expectJsonLike('[0].chatId', chatId)
          .expectJsonLike('[0].userId', chatMessageDto.listenerId);
        });
    });
    describe('Get chat', () => {
      it('Should get all chat messages',() => {
        return pactum
          .spec()
          .get(`/chat/${chatId}`)
          .withHeaders({...authHeader})
          .expectStatus(200)
          .expectJsonLike('[0].message', chatMessageDto.message)
          .expectJsonLike('[1].message', chatMessageDto.message)
          .expectJsonLike('[0].chatId', chatId)
          .expectJsonLike('[1].chatId', chatId)
      });
      it('Should get no messages an unexitant chatId',() => {
        return pactum
          .spec()
          .get(`/chat/${unkownUUID}`)
          .withHeaders({...authHeader})
          .expectStatus(200)
          .expectBody([])
      });
    });
    describe('Edit chat message', () => {
      it('Should be edit 1st chat message',() => {
        return pactum
          .spec()
          .put(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody({
            ...editMessage1Dto
          })
          .expectStatus(200)
          .expectJsonLike('chatMessageId', editMessage1Dto.chatMessageId)
          .expectJsonLike('message', editMessage1Dto.message)
      });
      it('Should be edit 2nd chat message',() => {
        return pactum
          .spec()
          .put(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody({
            ...editMessage2Dto
          })
          .expectStatus(200)
          .expectJsonLike('chatMessageId', editMessage2Dto.chatMessageId)
          .expectJsonLike('message', editMessage2Dto.message)
      });
      it('Shouldn\'t be edit unkown chat message',() => {
        return pactum
          .spec()
          .put(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody({
            chatMessageId: unkownUUID,
            message: "Unkown chatMessageId should not be edited",
          })
          .expectStatus(404);
      });
      it('Shouldn\'t be edit chat message whithout mesage bad request',() => {
        return pactum
          .spec()
          .put(`/chat/message`)
          .withHeaders({...authHeader})
          .withBody({
            chatMessageId: editMessage1Dto.chatMessageId,
          })
          .expectStatus(400);
      });
    });
    describe('Delete chat message', () => {
      it('Should be delete 1st chat message',() => {
        return pactum
          .spec()
          .delete(`/chat/message/${editMessage1Dto.chatMessageId}`)
          .withHeaders({...authHeader})
          .expectStatus(200)
          .expectJsonLike('chatMessageId', editMessage1Dto.chatMessageId)
          .expectJsonLike('message', editMessage1Dto.message)
      });
      it('Shouldn\'t be delete 1st chat message twice',() => {
        return pactum
          .spec()
          .delete(`/chat/message/${editMessage1Dto.chatMessageId}`)
          .withHeaders({...authHeader})
          .expectStatus(404)
          .expectJson({
            "response": "Not Found"
          })
      });      
    });
  });

  describe('Channel', () => {
    const publicChannelDto = {
      channelName: "publicChannel"
    }
    const privateChannelDto = {
      channelName: "privateChannel",
      password: "P4ssw0rd!"
    }
    // const channelMessageDto = {
    //   listenerId: '$S{userId}',
    //   message: "Hi! this is the FIRST message",
    // };
    // const publicChannelId: string= '$S{publicChannelId}';
    // const privateChannelId: string= '$S{privateChannelId}';
    // const editMessage1Dto = {
    //   channelMessageId: '$S{channelMessage1Id}',
    //   message: "Hi! this is the FIRST message edited",
    // }
    // const editMessage2Dto = {
    //   channelMessageId: '$S{channelMessage2Id}',
    //   message: "Hi! this is the SECOND message edited",
    // }
    describe('Create Channel', () => { 
      it('Should be created public channel',() => {
        return pactum
          .spec()
          .post(`/channel`)
          .withHeaders({...authHeader})
          .withBody({ ...publicChannelDto })
          .stores('publicChannelId','response.channel.channelId')
          .expectStatus(201)

          .expectJsonLike('response.channel.channelName', publicChannelDto.channelName)
          .expectJsonLike('response.channel.createdBy', '$S{myUserId}')

          .expectJsonLike('response.channelUser.userId', '$S{myUserId}')
          .expectJsonLike('response.channelUser.isAdmin', true)
          .expectJsonLike('response.channelUser.isOwner', true)
          .expectJsonLike('response.channelUser.isBanned', false)
          .expectJsonLike('response.channelUser.mutedUntill', null)
          .expectJsonLike('response.channelUser.leaveAt', null)
      });
      it('Should be created private channel',() => {
          return pactum
          .spec()
          .post(`/channel`)
          .withHeaders({...authHeader})
          .withBody({...privateChannelDto})
          .stores('privateChannelId','response.channelId')
          .expectStatus(201)

          .expectJsonLike('response.channel.channelName', privateChannelDto.channelName)
          .expectJsonLike('response.channel.createdBy', '$S{myUserId}')

          .expectJsonLike('response.channelUser.userId', '$S{myUserId}')
          .expectJsonLike('response.channelUser.isAdmin', true)
          .expectJsonLike('response.channelUser.isOwner', true)
          .expectJsonLike('response.channelUser.isBanned', false)
          .expectJsonLike('response.channelUser.mutedUntill', null)
          .expectJsonLike('response.channelUser.leaveAt', null)
      });
    });
    
  });


});