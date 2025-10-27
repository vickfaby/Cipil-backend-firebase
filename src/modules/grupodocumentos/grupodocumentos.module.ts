import { Module } from '@nestjs/common';
import { GrupodocumentosService } from './grupodocumentos.service';
import { GrupodocumentosController } from './grupodocumentos.controller';
import {
  Grupodocumentos,
  GrupodocumentosSchema,
} from './entities/grupodocumentos.entity';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [GrupodocumentosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Grupodocumentos.name,
        schema: GrupodocumentosSchema,
      },
    ]),
  ],
  providers: [GrupodocumentosService],
})
export class GrupodocumentosModule {}
