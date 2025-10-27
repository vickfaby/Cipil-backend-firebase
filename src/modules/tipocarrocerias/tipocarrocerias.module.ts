import { Module } from '@nestjs/common';
import { TipocarroceriasService } from './tipocarrocerias.service';
import { TipocarroceriasController } from './tipocarrocerias.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tipocarrocerias,
  TipocarroceriasSchema,
} from './entities/tipocarrocerias.entity';

@Module({
  controllers: [TipocarroceriasController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tipocarrocerias.name,
        schema: TipocarroceriasSchema,
      },
    ]),
  ],
  providers: [TipocarroceriasService],
  exports: [TipocarroceriasService],
})
export class TipocarroceriasModule {}
