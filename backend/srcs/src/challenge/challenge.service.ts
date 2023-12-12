import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ChallengeService {
    constructor (
        private eventEmitter: EventEmitter2
        ) {}

    private _usersIdPlaying: Map<string, number> = new Map<string, number>();
    private _usersIdOnChallenge: Map<string, string> = new Map<string, string>();

    createChallenge(challengerUserId: string, challengedUserId: string){
        if (this._usersIdPlaying.has(challengedUserId) || this._usersIdPlaying.has(challengerUserId)){
            throw new HttpException(
                {response:  'User already playing'},
                HttpStatus.CONFLICT,
            );
        } else if (this._usersIdOnChallenge.has(challengedUserId) || this._usersIdOnChallenge.has(challengerUserId)) {
            throw new HttpException(
                {response:  'User not availabe to be challenged'},
                HttpStatus.CONFLICT,
            );
        }
        this._usersIdOnChallenge.set(challengedUserId, challengerUserId);
        this._usersIdOnChallenge.set(challengerUserId, challengedUserId);
        this.eventEmitter.emit('hereComesANewChallenger', challengerUserId, challengedUserId);
    }

    acceptChallenge(challengerUserId: string, challengedUserId: string) {
        this.eventEmitter.emit('acceptChallenge', challengerUserId, challengedUserId);
     }

    cancelChallenge(challengerUserId: string, challengedUserId: string) {
        const userIds =  this._getUserIds(challengerUserId,challengedUserId);
        this.eventEmitter.emit('clearChallenges', userIds);
        this._cleanUsersIdOnChallenge(userIds);
    }
    
    rejectChallenge(challengerUserId: string, challengedUserId: string) {
        const userIds =  this._getUserIds(challengerUserId, challengedUserId);
        this.eventEmitter.emit('clearChallenges', userIds);
        this._cleanUsersIdOnChallenge(userIds);
    }

    @OnEvent('disconnectChallenges')
    disconnectChallenges(userId: string) {
        const userIds =  this._getUserIds(userId, '');
        if (userIds.length !== 0)
        {
            this.eventEmitter.emit('clearChallenges', userIds);
            this._cleanUsersIdOnChallenge(userIds);
        }
    }

    @OnEvent('addUserIdsPlaying')
    addUserIdsPlaying(userIds: string[], gameId: number){
        for (const userId of userIds){         
            if (this._usersIdPlaying.has(userId) === false) {
                this._usersIdPlaying.set(userId, gameId);
                this.eventEmitter.emit('userStartPlaying', userId, gameId);
            }
            this._removeUserIdFromChallenging(userId);
        }
    }

    @OnEvent('deleteUserIdsPlaying')
    deleteUserIdsPlaying(userIds: string[]){
        for (const userId of userIds){
            if (this._usersIdPlaying.has(userId)) {
                this._usersIdPlaying.delete(userId);
            }
        }
        this.eventEmitter.emit('usersStopPlaying', userIds);
    }

    @OnEvent('addUserIdsWaiting')
    addUserIdsWaiting(userId: string){
        this._usersIdOnChallenge.set(userId, 'ToBeDetermined');
    }

    @OnEvent('deleteUserIdsWaiting')
    deleteUserIdsWaiting(userId: string){
        this._removeUserIdFromChallenging(userId);
    }

    private _getUserIds(challengerUserId: string, challengedUserId: string): string[] {
        const challenged = this._usersIdOnChallenge.get(challengerUserId);
        const challenger = this._usersIdOnChallenge.get(challengedUserId);
        const userIds: string[] = [challengedUserId, challengerUserId, challenger, challenged];
        return [ ...new Set(userIds)];
    }

    private _cleanUsersIdOnChallenge(userIds: string[]) {
        for (const userId of userIds){
            this._removeUserIdFromChallenging(userId);
        }
    } 

    private _removeUserIdFromChallenging(userId:string){
        if (this._usersIdOnChallenge.has(userId)) {
            this._usersIdOnChallenge.delete(userId);
        }
    }


}
