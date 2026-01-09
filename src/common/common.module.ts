import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt.guard";
import { Reflector } from "@nestjs/core";
import { APP_CONFIG } from "./constants/app.constant";
import { RolesGuard } from "./guards/roles.guard";
import { PermissionsGuard } from "./guards/permissions.guard";

@Module({
    imports: [
        JwtModule.register({
            secret: APP_CONFIG.JWT_SECRET,
            global: true,
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [JwtGuard, Reflector, RolesGuard, PermissionsGuard],
    exports: [JwtGuard, JwtModule, RolesGuard, PermissionsGuard],
})
export class CommonModule { }
