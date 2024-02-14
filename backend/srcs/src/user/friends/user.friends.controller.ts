import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Param,
} from "@nestjs/common";
import { UserFriendsService } from "./user.friends.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "../../auth/guard";
import { GetUser } from '../../auth/decorator';
import { FriendDto } from "../dto";

@Controller("userFriends")
@ApiTags("userFriends")
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UserFriendsController {
  constructor(private userFriendsService: UserFriendsService) { }

  @Get('myFriends')
  @ApiOperation({
    description: 'Get user friends',
  })
  async getMyFriends(@GetUser('id') userId: string) {
    return {
      response: await this.userFriendsService.getFriendList(userId)
    };
  }

  @Get(':uuid')
  @ApiOperation({
    description: 'Get friend by id',
  })
  @ApiParam({
    name: "uuid",
    type: String,
    required: true,
    description: "Uuid of the friend",
    example: "903af193-666f-47eb-9b37-35ca3d58d4ec",
  })
  async getFriendById(@GetUser('id') userId: string, @Param('uuid') friendUuid : string) {
    return {
      response: await this.userFriendsService.getFriendById(userId, friendUuid)
    };
  }

  @Post()
  @ApiOperation({
    description: "Add a friend",
  })
  @ApiBody({
    type: FriendDto
  })
  @ApiResponse({
    status: 204,
    description: "Friend added correctly",
  })
  new(@GetUser('id') uuid: string, @Body() dto: FriendDto) {
    return this.userFriendsService.newFriend(uuid, dto.friendId);
  }

  @Delete()
  @ApiOperation({
    description: "Delete a friend",
  })
  @ApiBody({
    type: FriendDto
  })
  @ApiResponse({
    status: 204,
    description: "Friend deleted correctly",
  })
  delete(@GetUser('id') uuid: string, @Body() dto: FriendDto) {
    return this.userFriendsService.deleteFriend(uuid, dto.friendId);
  }

}
