import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt.guard";
import { Reflector } from "@nestjs/core";
import { APP_CONFIG } from "./constants/app.constant";

@Module({
    imports: [
        JwtModule.register({
            secret: APP_CONFIG.JWT_SECRET,
            global: true,
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [JwtGuard, Reflector],
    exports: [JwtGuard, JwtModule],
})
export class CommonModule { }
