import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiOperation({
    description: 'Get all users avaiable',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
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
          id: 42,
          username: 'marvin',
          email: 'marvin@mail.com',
          url: 'https://profile.intra.42.fr/users/marvin',
        },
      },
      example2: {
        value: {
          id: 43,
          username: 'santana',
          email: 'santana@mail.com',
          url: 'https://profile.intra.42.fr/users/santana',
          firstName: 'Eduardo',
          lastName: 'Santana',
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
