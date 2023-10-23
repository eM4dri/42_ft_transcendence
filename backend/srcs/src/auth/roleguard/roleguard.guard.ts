import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../role.enum";

@Injectable()
export class RoleguardGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    //private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role>(
      "role",
      context.getHandler(),
    ); // Obtener el rol requerido
    const { user } = context.switchToHttp().getRequest();
    const userRole = user.role; // Obtener el rol del usuario desde el token

    if (userRole === Role.Owner) { // Admin tiene acceso a todo
      return true;
    }

    if (!requiredRoles) {
      return true; // Si no se especificaron roles, la ruta es accesible por todos
    }

    return userRole === requiredRoles;
  }
}
