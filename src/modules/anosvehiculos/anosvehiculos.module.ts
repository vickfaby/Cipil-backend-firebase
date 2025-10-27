import { Module } from '@nestjs/common';
import { AnosvehiculosService } from './anosvehiculos.service';
import { AnosvehiculosController } from './anosvehiculos.controller';
import { ConfigModule } from '@nestjs/config';
import {
  Anosvehiculos,
  AnosvehiculosSchema,
} from './entities/anosvehiculos.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AnosvehiculosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Anosvehiculos.name,
        schema: AnosvehiculosSchema,
      },
    ]),
  ],
  providers: [AnosvehiculosService],
  exports: [AnosvehiculosService],
})
export class AnosvehiculosModule {}
