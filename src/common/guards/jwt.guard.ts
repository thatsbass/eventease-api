import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { APP_MESSAGES } from "../constants/message.constant";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException(APP_MESSAGES.UNAUTHORIZED);

    try {
      req.user = this.jwt.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException(APP_MESSAGES.UNAUTHORIZED);
    }
  }
}
