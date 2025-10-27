import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './entities/resume.entity';
import { SeguridadsocialesModule } from '../seguridadsociales/seguridadsociales.module';
import { ReferenciasModule } from '../referencias/referencias.module';
import { DocumentoscargadosresumeModule } from '../documentoscargadosresume/documentoscargadosresume.module';
import { TipodocumentosModule } from '../tipodocumentos/tipodocumentos.module';
import {
  Auditoriadocsoperador,
  AuditoriadocsoperadorSchema,
} from '../auditoriadocsoperador/entities/auditoriadocsoperador.entity';

import { PaginationV2Middleware } from 'src/common/middleware/pagination-v2.middleware';
import { CountriesModule } from '../countries/countries.module';
import { StatesModule } from '../states/states.module';
import { CitiesModule } from '../cities/cities.module';
import { LogimpresionesModule } from '../logimpresiones/logimpresiones.module';

@Module({
  controllers: [ResumeController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Resume.name,
        schema: ResumeSchema,
      },
      {
        name: Auditoriadocsoperador.name,
        schema: AuditoriadocsoperadorSchema,
      },
    ]),
    ReferenciasModule,
    SeguridadsocialesModule,
    DocumentoscargadosresumeModule,
    TipodocumentosModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    LogimpresionesModule,
  ],
  providers: [ResumeService],
})
export class ResumeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationV2Middleware).forRoutes(ResumeController);
  }
}
