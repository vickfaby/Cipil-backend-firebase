import { Module } from '@nestjs/common';
import { DocumentoscargadosengancheService } from './documentoscargadosenganche.service';
import { DocumentoscargadosengancheController } from './documentoscargadosenganche.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Documentoscargadosenganche,
  DocumentoscargadosengancheSchema,
} from './entities/documentoscargadosenganche.entity';

@Module({
  controllers: [DocumentoscargadosengancheController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Documentoscargadosenganche.name,
        schema: DocumentoscargadosengancheSchema,
      },
    ]),
  ],
  providers: [DocumentoscargadosengancheService],
  exports: [DocumentoscargadosengancheService],
})
export class DocumentoscargadosengancheModule {}
