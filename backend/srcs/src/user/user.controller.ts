import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiOperation({
    description: 'Get all users avaiable',
  })
  all() {
    return this.userService.all();
  }

  @Get(':email')
  @ApiOperation({
    description: 'Get a user',
  })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description: 'Mail of the user',
    example: 'user1@mail.com',
  })
  @ApiResponse({
    status: 200,
    description: `User returned correctly<br\>
                  User not found`,
  })
  get(@Param('email') email: string) {
    return this.userService.get(email);
  }

  @Post()
  @ApiOperation({
    description: 'Crea un usuario',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Crea un usuario CreateUserDto',
    examples: {
      example1: {
        value: {
          email: 'user1@mail.com',
        },
      },
      example2: {
        value: {
          email: 'user2@mail.com',
          firstName: 'Name2',
          lastName: 'Last2',
        },
      },
      example3: {
        value: {
          email: 'user3@mail.com',
          firstName: 'Name3',
        },
      },
      example4: {
        value: {
          email: 'user4@mail.com',
          lastName: 'Last4',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created correctly',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  new(@Body() dto: CreateUserDto) {
    return this.userService.new(dto);
  }
}
