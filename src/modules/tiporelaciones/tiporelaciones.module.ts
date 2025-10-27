import { Module } from '@nestjs/common';
import { TiporelacionesService } from './tiporelaciones.service';
import { TiporelacionesController } from './tiporelaciones.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tiporelaciones,
  TiporelacionesSchema,
} from './entities/tiporelaciones.entity';

@Module({
  controllers: [TiporelacionesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tiporelaciones.name,
        schema: TiporelacionesSchema,
      },
    ]),
  ],
  providers: [TiporelacionesService],
  exports: [TiporelacionesService],
})
export class TiporelacionesModule {}
