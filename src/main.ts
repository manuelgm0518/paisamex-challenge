require('module-alias/register');
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { EnvironmentService } from '@core/services';
import { AppModule } from './app.module';
import { AuthenticationService } from '@authentication/services';
import { SessionService } from '@users/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environment = app.get(EnvironmentService);
  const version = environment.get('VERSION');

  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: version.toString() });

  const config = new DocumentBuilder()
    .setTitle('Paisamex Challenge - Backend')
    .setDescription('API methods and schemas documentation')
    .setVersion(version.toFixed(1))
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(environment.get('PORT'));
  console.log(`Server ready at ${await app.getUrl()}`);

  const authService = app.get(AuthenticationService);
  const sessionService = app.get(SessionService);
  authService.syncAuthRoles();
  sessionService.testAdmin();
}
bootstrap();
