import { Module } from '@nestjs/common';
import { TipovehiculosService } from './tipovehiculos.service';
import { TipovehiculosController } from './tipovehiculos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tipovehiculos,
  TipovehiculosSchema,
} from './entities/tipovehiculos.entity';

@Module({
  controllers: [TipovehiculosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tipovehiculos.name,
        schema: TipovehiculosSchema,
      },
    ]),
  ],
  providers: [TipovehiculosService],
  exports: [TipovehiculosService],
})
export class TipovehiculosModule {}
