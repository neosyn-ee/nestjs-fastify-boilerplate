import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/jwt/guard/jwtAuth.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard)
@ApiCookieAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a user by ID',
    description:
      'This endpoint allows you to retrieve a user by their unique ID. It returns the user details if the ID is valid, or a 404 error if the user is not found.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUser(Number(id));
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all users',
    description:
      'This endpoint returns a list of all users in the system. It is a simple GET request to retrieve all available user records.',
  })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'This endpoint allows you to create a new user by providing the necessary details in the request body. A new user will be created with the provided data.',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
    description:
      'This endpoint allows you to update an existing user by providing their unique ID and the new data in the request body. If the user is not found, a 404 error will be returned.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(Number(id), userData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description:
      'This endpoint allows you to delete a user by their unique ID. If the user is not found, a 404 error will be returned. Successful deletion returns a 204 status.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(Number(id));
  }
}
