import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ResumevehiculoService } from './resumevehiculo.service';
import { ResumevehiculoController } from './resumevehiculo.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose_paginate = require('mongoose-paginate-v2');
import { PaginationV2Middleware } from 'src/common/middleware/pagination-v2.middleware';

import {
  Resumevehiculo,
  ResumevehiculoSchema,
} from './entities/resumevehiculo.entity';
import { DocumentoscargadosvehiculoModule } from '../documentoscargadosvehiculo/documentoscargadosvehiculo.module';
import { DocumentoscargadosengancheModule } from '../documentoscargadosenganche/documentoscargadosenganche.module';
import { LogimpresionesModule } from '../logimpresiones/logimpresiones.module';
import { PlacaenganchesModule } from '../placaenganches/placaenganches.module';
import { AnosvehiculosModule } from '../anosvehiculos/anosvehiculos.module';
import { ModelosvehiculosModule } from '../modelosvehiculos/modelosvehiculos.module';
import { MarcasvehiculosModule } from '../marcasvehiculos/marcasvehiculos.module';
import { ClasesvehiculosModule } from '../clasesvehiculos/clasesvehiculos.module';
import { TipovehiculosModule } from '../tipovehiculos/tipovehiculos.module';
import { TipocarroceriasModule } from '../tipocarrocerias/tipocarrocerias.module';
import { EmpresagpsModule } from '../empresagps/empresagps.module';
import {
  Auditoriadocsvehiculo,
  AuditoriadocsvehiculoSchema,
} from '../auditoriadocsvehiculo/entities/auditoriadocsvehiculo.entity';

@Module({
  controllers: [ResumevehiculoController],
  imports: [
    DocumentoscargadosvehiculoModule,
    DocumentoscargadosengancheModule,
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: Resumevehiculo.name,
        useFactory: () => {
          const schema = ResumevehiculoSchema;
          schema.plugin(mongoose_paginate);
          return schema;
        },
      },
      {
        name: Auditoriadocsvehiculo.name,
        useFactory: () => {
          const schema = AuditoriadocsvehiculoSchema;
          schema.plugin(mongoose_paginate);
          return schema;
        },
      },
    ]),
    PlacaenganchesModule,
    LogimpresionesModule,
    ClasesvehiculosModule,
    EmpresagpsModule,
    AnosvehiculosModule,
    MarcasvehiculosModule,
    ModelosvehiculosModule,
    TipovehiculosModule,
    TipocarroceriasModule,
  ],
  providers: [ResumevehiculoService],
  exports: [ResumevehiculoService, MongooseModule],
})
export class ResumevehiculoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationV2Middleware)
      .forRoutes(ResumevehiculoController);
  }
}
