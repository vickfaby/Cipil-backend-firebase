import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ResumevehiculoService } from './resumevehiculo.service';
import { ResumevehiculoController } from './resumevehiculo.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import mongoose_paginate = require('mongoose-paginate-v2');
import type { Connection } from 'mongoose';
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
import {
  Posiciondisponible,
  PosiciondisponibleSchema,
} from '../posicion_disponible/entities/posicion_disponible.entity';

@Module({
  controllers: [ResumevehiculoController],
  imports: [
    DocumentoscargadosvehiculoModule,
    DocumentoscargadosengancheModule,
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: Resumevehiculo.name,
        useFactory: (connection: Connection) => {
          const schema = ResumevehiculoSchema;
          schema.plugin(mongoose_paginate);
          // Drop the legacy unique index on placa_enganche (single string).
          // The field was replaced by placas_enganche (array) and the old index
          // blocks creation when placa_enganche is null for every new document.
          const dropIndex = async () => {
            try {
              await connection
                .collection('resumevehiculos')
                .dropIndex('placa_enganche_1');
              console.log('Successfully dropped legacy index: placa_enganche_1');
            } catch (_) {
              // Index does not exist or was already dropped — safe to ignore.
            }
          };

          if (connection.readyState === 1) {
            dropIndex();
          } else {
            connection.on('open', dropIndex);
          }
          return schema;
        },
        inject: [getConnectionToken()],
      },
      {
        name: Auditoriadocsvehiculo.name,
        useFactory: () => {
          const schema = AuditoriadocsvehiculoSchema;
          schema.plugin(mongoose_paginate);
          return schema;
        },
      },
      {
        name: Posiciondisponible.name,
        useFactory: () => {
          const schema = PosiciondisponibleSchema;
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
