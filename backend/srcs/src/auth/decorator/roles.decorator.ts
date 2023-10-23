import { SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "../role.enum";
import { RoleguardGuard } from "../roleguard/roleguard.guard";

export const Roles = (...roles: Role[]) => {
  ////////////////////////////////////////////////////////////////////
  //OJO si se usa se tiene que importar en el provider el JwtService//
  ////////////////////////////////////////////////////////////////////
  return (target, key, descriptor) => {
    SetMetadata("role", roles)(target, key, descriptor);
    UseGuards(RoleguardGuard)(target, key, descriptor);
  };
};
