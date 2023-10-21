import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt';
import { Role } from '../role.enum';

@Injectable()
export class RoleguardGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role[]>('role', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    const userRoles = user.role;

    if (!requiredRoles) {
      return true; // Si no se especificaron roles, la ruta es accesible por todos
    }

    return requiredRoles.some((role: Role) => userRoles.includes(role));

  }
}
