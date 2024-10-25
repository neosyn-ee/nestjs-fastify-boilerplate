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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' }) // Summary for Swagger
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' }) // Document the 'id' parameter
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUser(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
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
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(Number(id));
  }
}
