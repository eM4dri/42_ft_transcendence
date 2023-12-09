import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../role.enum";

// Para usar este WsGuard, se debe
// import { Roles } from 'src/auth/decorator/roles.decorator';
// import { Role } from 'src/auth/role.enum';
// A la altura del controller:
// @Get(':uuid/users')
// @Roles(Role.Admin, Role.Owner)
//
@Injectable()
export class RoleguardGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // En caso de poner de decorador:
    // @Roles(Role.Admin, Role.User)
    // esto de aqui recibe dos roles posibles, y el bicho de abajo devuelve "ROL1,ROL2"
    const requiredRoles : string = this.reflector.get<Role>(
      "role",
      context.getHandler(),
    );

    const { user } = context.switchToHttp().getRequest();
    const userRole = user.role; // Obtener el rol del usuario desde el token

    if (userRole === Role.Owner) { // Admin tiene acceso a todo
      return true;
    }
    if (requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.includes(userRole)
  }
}
