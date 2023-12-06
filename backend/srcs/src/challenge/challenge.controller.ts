import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChallengeService } from './challenge.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';


@Controller('challenge')
@ApiTags('challenge')
@UseGuards(JwtGuard)
export class ChallengeController {
    constructor(private challengeService: ChallengeService) {}
    @Get('/:uuid')
    createChallenge(
        @GetUser('id') challengerUserid: string,
        @Param('uuid', new ParseUUIDPipe()) challengedUserid: string
    ) {
      return this.challengeService.createChallenge(challengerUserid, challengedUserid);
    }

    @Get('/accept/:uuid')
    acceptChallenge(
        @GetUser('id') challengerUserid: string,
        @Param('uuid', new ParseUUIDPipe()) challengedUserid: string
    ) {
      return this.challengeService.acceptChallenge(challengerUserid, challengedUserid);
    }

    @Get('/cancel/:uuid')
    cancelChallenge(
        @GetUser('id') challengerUserid: string,
        @Param('uuid', new ParseUUIDPipe()) challengedUserid: string
    ) {
      return this.challengeService.cancelChallenge(challengerUserid, challengedUserid);
    }

    @Get('/reject/:uuid')
    rejectChallenge(
        @GetUser('id') challengerUserid: string,
        @Param('uuid', new ParseUUIDPipe()) challengedUserid: string
    ) {
      return this.challengeService.rejectChallenge(challengerUserid, challengedUserid);
    }


}
