import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditoriadocumentosengancheController } from './auditoriadocumentosenganche.controller';
import { AuditoriadocumentosengancheService } from './auditoriadocumentosenganche.service';
import {
  Auditoriadocumentosenganche,
  AuditoriadocumentosengancheSchema,
} from './entities/auditoriadocumentosenganche.entity';
import { Resume, ResumeSchema } from '../resume/entities/resume.entity';
import {
  Documentoscargadosresume,
  DocumentoscargadosresumeSchema,
} from '../documentoscargadosresume/entities/documentoscargadosresume.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';

@Module({
  controllers: [AuditoriadocumentosengancheController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Auditoriadocumentosenganche.name,
        schema: AuditoriadocumentosengancheSchema,
      },
      { name: Resume.name, schema: ResumeSchema },
      {
        name: Documentoscargadosresume.name,
        schema: DocumentoscargadosresumeSchema,
      },
      { name: Usuarios.name, schema: UsuariosSchema },
    ]),
  ],
  providers: [AuditoriadocumentosengancheService],
  exports: [AuditoriadocumentosengancheService],
})
export class AuditoriadocumentosengancheModule {}

