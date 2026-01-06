import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/types/user.type';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // @Post()
    // create(@Body() user: User): Promise<User> {
    //     return this.userService.create(user);
    // }

    @Get(':id')
    getUser(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }
}
