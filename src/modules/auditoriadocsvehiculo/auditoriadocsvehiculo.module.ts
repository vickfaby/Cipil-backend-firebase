import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditoriadocsvehiculoController } from './auditoriadocsvehiculo.controller';
import { AuditoriadocsvehiculoService } from './auditoriadocsvehiculo.service';
import { Auditoriadocsvehiculo, AuditoriadocsvehiculoSchema } from './entities/auditoriadocsvehiculo.entity';
import { Resumevehiculo, ResumevehiculoSchema } from '../resumevehiculo/entities/resumevehiculo.entity';
import { Documentoscargadosvehiculo, DocumentoscargadosvehiculoSchema } from '../documentoscargadosvehiculo/entities/documentoscargadosvehiculo.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';

@Module({
  controllers: [AuditoriadocsvehiculoController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Auditoriadocsvehiculo.name, schema: AuditoriadocsvehiculoSchema },
      { name: Resumevehiculo.name, schema: ResumevehiculoSchema },
      { name: Documentoscargadosvehiculo.name, schema: DocumentoscargadosvehiculoSchema },
      { name: Usuarios.name, schema: UsuariosSchema },
    ]),
  ],
  providers: [AuditoriadocsvehiculoService],
  exports: [AuditoriadocsvehiculoService],
})
export class AuditoriadocsvehiculoModule {}



