import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private authService: AuthService
    ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<any>  {
      // I can't pass any info(User) from the middleware, unsing switchToWs, so I would go with switchToHttp instead
    const request = context.switchToHttp().getRequest();
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    try {
      request['user'] = this.authService.isAuthorized(request); 
    } catch (error) {
      return false;
    }
    return true;
  }
}
