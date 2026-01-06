import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserPayload } from './jwt.strategy';
import { AuthResponseDto } from './dto/auth-response';



@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    async login(credentials: LoginRequestDto): Promise<AuthResponseDto> {
        const { email, password } = credentials;
        const existingUser = await this.prismaService.user.findUnique({
            where: {
                email,
            }
        })
        if (!existingUser) {
            throw new Error('User not found');
        }
        const isPasswordValid = await this.comparePassword(password, existingUser.password);

        if (!isPasswordValid) {
            throw new Error('Email or password is incorrect');
        }
        // --- Generate TOKEN --
        const token = this.authentificateUser({ userId: existingUser.id });
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

    private authentificateUser({ userId }: UserPayload) {
        const payload: UserPayload = { userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
