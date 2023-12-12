import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ParseUUIDPipe,
  Patch
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto, PatchUserDto } from "./dto";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from 'src/auth/decorator';

@Controller("user")
@ApiTags("user")
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) { }

  @Get('all')
  @ApiOperation({
    description: "Get all users avaiable",
  })
  @ApiBearerAuth()
  async all() {
    return { response: await this.userService.all() };
  }

  @Get('myUser')
  @ApiOperation({
    description: 'Get user by uuid',
  })
  async getMyUser(@GetUser('id') userId: string) {
    return this.userService.getByUserId(
      userId,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    description: 'Get user by uuid',
  })
  @ApiParam({
    name: "uuid",
    type: String,
    required: true,
    description: "Uuid of the user",
    example: "903af193-666f-47eb-9b37-35ca3d58d4ec",
  })
  @ApiResponse({
    status: 200,
    description: `User returned correctly<br\>
                  User not found`,
  })
  getUserByUuid(
    @Param('uuid', new ParseUUIDPipe()) userId: string,
  ) {
    return this.userService.getByUserId(
      userId,
    );
  }

  @Post()
  @ApiOperation({
    description: "Create a user",
  })
  @ApiBody({
    type: CreateUserDto,
    description: "Create a user CreateUserDto",
    examples: {
      example1: {
        value: {
          id: 42,
          username: "marvin",
          email: "marvin@mail.com",
          url: "https://profile.intra.42.fr/users/marvin",
        },
      },
      example2: {
        value: {
          id: 43,
          username: "santana",
          email: "santana@mail.com",
          url: "https://profile.intra.42.fr/users/santana",
          firstName: "Eduardo",
          lastName: "Santana",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "User created correctly",
  })
  @ApiResponse({
    status: 409,
    description: "Email already in use",
  })
  new(@Body() dto: CreateUserDto) {
    return this.userService.new(dto);
  }

  @Patch(':uuid')
  @ApiOperation({
    description: "Edit a user",
  })
  @ApiParam({
    name: "uuid",
    type: String,
    required: true,
    description: "Uuid of the user",
    example: "903af193-666f-47eb-9b37-35ca3d58d4ec",
  })
  @ApiBody({
    type: PatchUserDto,
    description: "Edit a user PatchUserDto",
    examples: {
      example1: {
        value: {
          username: "marvin",
        },
      },
      example2: {
        value: {
          username: "santana",
          firstName: "Eduardo",
          lastName: "Santana",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "User modified correctly",
  })
  @ApiResponse({
    status: 409,
    description: "Email already in use",
  })
  patch(@Param("uuid") userId: string, @Body() dto: PatchUserDto) {
    return this.userService.update(userId, dto);
  }

  //  @Get("user")
  //  @ApiOperation({ description: "Get user by id" })
  //  @ApiQuery({ name: "id", required: false, type: String })
  //  async get_user_by_id(@Query("id") id: string) {
  //    return id;
  //  }
}
