import { SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../role.enum';
import { RoleguardGuard } from '../roleguard/roleguard.guard';

export const Roles = (role: Role) => {
  return (target, key, descriptor) => {
    SetMetadata('role', role)(target, key, descriptor);
    UseGuards(RoleguardGuard)(target, key, descriptor);
  };
};
