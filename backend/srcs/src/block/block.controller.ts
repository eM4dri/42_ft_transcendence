import { Controller,
         UseGuards,
         Get,
         Post,
         Delete,
         HttpCode,
         Param,
         ParseUUIDPipe
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiQuery,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { BlockService } from './block.service';

// El modulo de silenciados se utilizara, almenos de momento,
// para poder devolver en un login una lista de los silenciados
// que tenga cada persona al front.
// A parte, se añaden requests para poder bloquear o desbloquear a alguien.
@Controller('block')
@ApiTags('block')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class BlockController {
    constructor(private BlockService: BlockService){};

    @Get()
    @ApiOperation({ description: 'Get blocked list from one user' })
    get(@GetUser('id') UserId: string) {
      return this.BlockService.getBlockedList(UserId);
    };

    @Post('/:uuid')
    @ApiOperation({ description: 'Block a user' })
    @HttpCode(200)
    blockUser(
        @GetUser('id') userId_blocker: string,
        @Param('id_blocked', new ParseUUIDPipe()) userId_blocked: string
    ) {
        return this.BlockService.blockUser(userId_blocker, userId_blocked);
    }

    @Delete('/:uuid')
    @ApiOperation({ description: 'Unblock a user' })
    @HttpCode(200)
    unblockUser(
        @GetUser('id') userId_blocker: string,
        @Param('id_blocked', new ParseUUIDPipe()) userId_blocked: string
    ) {
        return this.BlockService.unblockUser(userId_blocker, userId_blocked);
    }
}