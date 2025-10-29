import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import morgan = require('morgan');
import compression = require('compression');
import { AppModule } from './app.module';
import { CORS } from './common/constants';
//import { GlobalExceptionFilter } from './common/utils/exception-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1');
  app.enableCors(CORS);
  app.use(compression());
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  const logger = new Logger('Running App');
  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 5001;

  const config = new DocumentBuilder()
    .setTitle('CIPIL Backend API')
    .setDescription(`
      API Backend para el sistema CIPIL (Sistema de Control de Información de Personas, Inmuebles y Logística).
      
      Esta API proporciona endpoints para gestionar:
      - Autenticación y autorización de usuarios
      - Gestión de usuarios y roles
      - Catálogos de vehículos (marcas, modelos, años, clases, tipos, colores)
      - Gestión de documentos y archivos
      - Información geográfica (países, estados, ciudades)
      - Procesos de registro y validación
      
      Versión: 1.0.0
    `)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addServer('http://localhost:3002', 'Servidor de Desarrollo')
    .addServer('https://api.cipilapp.com', 'Servidor de Producción')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('usuarios', 'Gestión de usuarios')
    .addTag('roles', 'Gestión de roles y permisos')
    .addTag('vehiculos', 'Información de vehículos')
    .addTag('catalogos', 'Catálogos del sistema')
    .addTag('geografia', 'Información geográfica')
    .addTag('documentos', 'Gestión de documentos')
    .addTag('procesos', 'Procesos de negocio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);
  logger.log(`App running on port ${configService.get('PORT')}`);
  logger.log(`Database running on port ${configService.get('MONGODB')}`);
  logger.log(`Swagger documentation available at: http://localhost:${configService.get('PORT')}/documentation`);
 // logger.log(`API_SENDGRID: ${configService.get('SENDGRID_API_KEY')}`);
 // logger.log(`API_SENDGRID_FROM_EMAIL: ${configService.get('SENDGRID_FROM_EMAIL')}`);
}
bootstrap();
