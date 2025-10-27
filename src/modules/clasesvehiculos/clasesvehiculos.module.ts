import { Module } from '@nestjs/common';
import { ClasesvehiculosService } from './clasesvehiculos.service';
import { ClasesvehiculosController } from './clasesvehiculos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Clasesvehiculos,
  ClasesvehiculosSchema,
} from './entities/clasesvehiculos.entity';

@Module({
  controllers: [ClasesvehiculosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Clasesvehiculos.name,
        schema: ClasesvehiculosSchema,
      },
    ]),
  ],
  providers: [ClasesvehiculosService],
  exports: [ClasesvehiculosService],
})
export class ClasesvehiculosModule {}
