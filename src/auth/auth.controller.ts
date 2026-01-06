import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthResponseDto } from './dto/auth-response';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() credentials: LoginRequestDto): Promise<AuthResponseDto> {
        return this.authService.login(credentials);
    }


    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() Request) {
        const user = await this.userService.findOne(Request.user.userId);
        console.log("USER CONNECTED : ", Request.user.userId);
        return user;
    }
}
