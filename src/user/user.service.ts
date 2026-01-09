import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/common/types/user.type';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        const users = await this.prismaService.user.findMany();
        const rest = users.map(user => {
            const { password, ...rest } = user;
            return rest;
        })
        return rest;
    }
    async create(user : User) {
        const createdUser = await this.prismaService.user.create({
            data: user,
        })
        return createdUser;
    }

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {email},
            include: {
                role: {
                    include: {
                        permissions: true,
                    },
                },
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
        const roleName = await this.getRoleName(user.roleId);
        const {password, ...rest} = user;
        return { ...rest, role: roleName };
    }

    async findRole(roleName: string) {
        const role = await this.prismaService.role.findUnique({
            where: {name: roleName},
            include: {
                permissions: true,
            },
        })
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    private async getRoleName(roleId: string) {
        const role = await this.prismaService.role.findUnique({
            where: {id: roleId},
        })
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role.name;
    }

}
