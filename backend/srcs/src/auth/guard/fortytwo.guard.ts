import { ConflictException, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoGuard extends AuthGuard(
  '42',
) {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err){
        if(err instanceof HttpException) {
          const httpErrorCode = err.getStatus();
          if (httpErrorCode === 409){
            throw new ConflictException(
              { response:'Username already in use' },
            );
          }
         } else if (err.oauthError.statusCode === 429) {
            throw new HttpException(
                { response:'Too Many Requests (Spam Rate Limit Exceeded)' },
                HttpStatus.TOO_MANY_REQUESTS,
              );
        } else {
          throw new UnauthorizedException(); //default error
        }
   }  else if (!user){
    throw new UnauthorizedException();
   }
    return user;
  }
}

