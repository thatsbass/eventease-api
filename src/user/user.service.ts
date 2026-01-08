import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
        const users = await this.prismaService.user.findMany();
        const rest = users.map(user => {
            const {password, ...rest} = user;
            return rest;
        })
        return rest;
    }
    async create(user: CreateUserDto) {
        const createdUser = await this.prismaService.user.create({
            data: user,
        })
        return createdUser;
    }

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        })
        return user;
    }

    async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        })
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const {password, ...rest} = user;
        return rest;
    }

}
