import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

// Este decorador sirve para extraer el objeto user del usuario que
// hace una petición. Forma de uso:
// foo(@GetUser('id'))
export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
