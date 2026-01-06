import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from 'src/auth/dto/register-request.dto';
import { PrismaService } from 'src/prisma.service';

import { CreatedUserResponseDto } from './dto/created-user-response.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}



    async create(user: RegisterRequestDto): Promise<CreatedUserResponseDto> {
        const createdUser = await this.prismaService.user.create({
            data: user,
        })
        return createdUser;
    }



    async findOne(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        })
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
