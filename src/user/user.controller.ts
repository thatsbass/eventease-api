import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/constants/roles.constant';
import { Roles as RolesGuard } from 'src/common/decorators/roles.decorator';
import { Permissions as PermissionsGuard } from 'src/common/decorators/permissions.decorator';
import { Permissions } from 'src/common/constants/permissions.constant';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @RolesGuard(Roles.ADMIN)
    @PermissionsGuard(Permissions.DASHBOARD_ADMIN)
    @Get()
    async findAll() {
        return this.userService.findAll();
    }
}
