import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}
