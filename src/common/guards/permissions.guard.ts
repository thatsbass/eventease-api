import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) return true;

    const req = context.switchToHttp().getRequest();
    const userPermissions: string[] = req.user.permissions;

    return requiredPermissions.every(p =>
      userPermissions.includes(p),
    );
  }
}
