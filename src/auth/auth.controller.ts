import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    async login(@Body() credentials: LoginDto) {
        return this.authService.login(credentials);
    }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('register')
    async register(@Body() data: CreateUserDto) {
        return this.authService.register(data);
    }


    @Get('profile')
    async getProfile(@Request() Request) {
        const user = await this.userService.findById(Request.user.userId);
        return user;
    }
}
