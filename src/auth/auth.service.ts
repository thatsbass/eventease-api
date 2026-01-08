import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { APP_MESSAGES } from 'src/common/constants/message.constant';



@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    async login(credentials: LoginDto) {
        const { email, password } = credentials;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException(APP_MESSAGES.INVALID_CREDENTIALS);
        }
        const match = await this.comparePassword(password, user.password);
        if (!match) throw new UnauthorizedException(APP_MESSAGES.INVALID_CREDENTIALS);

        // --- Generate TOKEN --
        const token = this.signInUser({ userId: user.id, email: user.email });
        return token;
    }


    async register(data: CreateUserDto) {
        const { name, email, password } = data;
        console.log(name, email, password);
        const user = await this.userService.findByEmail(email);
        if (user) {
            throw new UnauthorizedException(APP_MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        const hashedPassword = await this.hashPassword(password);
        const createdUser = await this.userService.create({ name, email, password: hashedPassword });
        const token = this.signInUser({ userId: createdUser.id, email: createdUser.email });
        return token;
    }


    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = await hash(password, 10);
        return hashedPassword;
    }

    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isPasswordValid = await compare(password, hashedPassword);
        return isPasswordValid;
    }

    private signInUser({ userId, email }: { userId: string, email: string }) {
        const payload = { email, userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
