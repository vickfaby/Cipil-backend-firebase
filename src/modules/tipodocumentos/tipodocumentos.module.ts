import { Module } from '@nestjs/common';
import { TipodocumentosService } from './tipodocumentos.service';
import { TipodocumentosController } from './tipodocumentos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tipodocumentos,
  TipodocumentosSchema,
} from './entities/tipodocumentos.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tipodocumentos.name,
        schema: TipodocumentosSchema,
      },
    ]),
  ],
  controllers: [TipodocumentosController],
  providers: [TipodocumentosService],
  exports: [TipodocumentosService],
})
export class TipodocumentosModule {}
