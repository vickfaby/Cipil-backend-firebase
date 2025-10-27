import { Module } from '@nestjs/common';
import { MarcasvehiculosService } from './marcasvehiculos.service';
import { MarcasvehiculosController } from './marcasvehiculos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Marcasvehiculos,
  MarcasvehiculosSchema,
} from './entities/marcasvehiculos.entity';

@Module({
  controllers: [MarcasvehiculosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Marcasvehiculos.name,
        schema: MarcasvehiculosSchema,
      },
    ]),
  ],
  providers: [MarcasvehiculosService],
  exports: [MarcasvehiculosService],
})
export class MarcasvehiculosModule {}
