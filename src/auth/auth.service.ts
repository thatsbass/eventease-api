import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { APP_MESSAGES } from 'src/common/constants/message.constant';
import { UserPayload } from 'src/common/types/user.type';


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

        const token = this.signInUser({
            userId: user.id,
            email: user.email,
            role: user.role.name,
            permissions: user.role.permissions.map(p => p.name)
        });
        return token;
    }


    async register(data: CreateUserDto) {
        const { fullName, email, password, phone } = data;
        const user = await this.userService.findByEmail(email);
        if (user) {
            throw new BadRequestException(APP_MESSAGES.EMAIL_ALREADY_EXISTS);
        }

        const role = await this.userService.findRole(data.role);
        const hashedPassword = await this.hashPassword(password);

        const createdUser = await this.userService.create({ fullName, email, password: hashedPassword, phone, roleId: role.id });
        const token = this.signInUser({
            userId: createdUser.id,
            email: createdUser.email,
            role: role.name,
            permissions: role.permissions.map(p => p.name)
        });
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

    private signInUser(payload: UserPayload) {
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
