export type PatchUserDto = {
    username?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    avatar?: string,
    twofa?: boolean,
    twofa_code?: string,
}