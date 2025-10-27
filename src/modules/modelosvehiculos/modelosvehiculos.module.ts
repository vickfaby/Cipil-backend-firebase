import { Module } from '@nestjs/common';
import { ModelosvehiculosService } from './modelosvehiculos.service';
import { ModelosvehiculosController } from './modelosvehiculos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Modelosvehiculos,
  ModelosvehiculosSchema,
} from './entities/modelosvehiculos.entity';

@Module({
  controllers: [ModelosvehiculosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Modelosvehiculos.name,
        schema: ModelosvehiculosSchema,
      },
    ]),
  ],
  providers: [ModelosvehiculosService],
  exports: [ModelosvehiculosService],
})
export class ModelosvehiculosModule {}
