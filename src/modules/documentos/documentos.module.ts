import { Module } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Documentos, DocumentosSchema } from './entities/documentos.entity';

@Module({
  controllers: [DocumentosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Documentos.name,
        schema: DocumentosSchema,
      },
    ]),
  ],
  providers: [DocumentosService],
})
export class DocumentosModule {}
