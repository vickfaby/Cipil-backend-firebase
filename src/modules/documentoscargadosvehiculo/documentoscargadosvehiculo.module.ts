import { Module } from '@nestjs/common';
import { DocumentoscargadosvehiculoService } from './documentoscargadosvehiculo.service';
import { DocumentoscargadosvehiculoController } from './documentoscargadosvehiculo.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Documentoscargadosvehiculo,
  DocumentoscargadosvehiculoSchema,
} from './entities/documentoscargadosvehiculo.entity';

@Module({
  controllers: [DocumentoscargadosvehiculoController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Documentoscargadosvehiculo.name,
        schema: DocumentoscargadosvehiculoSchema,
      },
    ]),
  ],
  providers: [DocumentoscargadosvehiculoService],
  exports: [DocumentoscargadosvehiculoService],
})
export class DocumentoscargadosvehiculoModule {}
