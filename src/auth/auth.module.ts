import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [AuthService, PrismaService, JwtStrategy, UserService],
  controllers: [AuthController],
  imports: [CommonModule],
})
export class AuthModule { }