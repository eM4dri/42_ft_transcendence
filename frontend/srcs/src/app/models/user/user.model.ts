import { Role } from "../core/role.model"

export type User = {
    userId: string,
    username: string,
    avatar?: string,
}

export interface UserExtended extends User {
    role: Role,
    isBanned: boolean,
  }