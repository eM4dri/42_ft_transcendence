import { Controller,
         UseGuards,
         Get,
         Post,
         Delete,
         HttpCode,
         Param,
         ParseUUIDPipe,
         Body
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
import { BlockedUserDto } from './dto/blockedUser.dto';

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
    @ApiOperation({
        description: 'Get blocked list from one user'
    })
    get(@GetUser('id') UserId: string) {
      return this.BlockService.getBlockedList(UserId);
    };

    @Post('/:uuid')
    @ApiBody({
        description: 'Block a user',
        type: BlockedUserDto
    })
    @HttpCode(200)
    blockUser(
        @GetUser('id') userId_blocker: string,
        @Body() dto : BlockedUserDto
    ) {
        return this.BlockService.blockUser(userId_blocker, dto.userId_blocked);
    }

    @Delete('/:uuid')
    @ApiBody({
        description: 'Block a user',
        type: BlockedUserDto
    })
    @HttpCode(200)
    unblockUser(
        @GetUser('id') userId_blocker: string,
        @Body() dto : BlockedUserDto
    ) {
        return this.BlockService.unblockUser(userId_blocker, dto.userId_blocked);
    }
}