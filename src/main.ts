import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { JwtGuard } from './common/guards/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { APP_CONFIG } from './common/constants/app.constant';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(APP_CONFIG.API_PREFIX!);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalGuards(
    app.get(JwtGuard),
    app.get(RolesGuard),
    app.get(PermissionsGuard)
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(APP_CONFIG.PORT!);
}
bootstrap();
