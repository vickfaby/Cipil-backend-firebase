import { Module } from '@nestjs/common';
import { DocumentoscargadosresumeService } from './documentoscargadosresume.service';
import { DocumentoscargadosresumeController } from './documentoscargadosresume.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Documentoscargadosresume,
  DocumentoscargadosresumeSchema,
} from './entities/documentoscargadosresume.entity';

@Module({
  controllers: [DocumentoscargadosresumeController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Documentoscargadosresume.name,
        schema: DocumentoscargadosresumeSchema,
      },
    ]),
  ],
  providers: [DocumentoscargadosresumeService],
  exports: [DocumentoscargadosresumeService],
})
export class DocumentoscargadosresumeModule {}
