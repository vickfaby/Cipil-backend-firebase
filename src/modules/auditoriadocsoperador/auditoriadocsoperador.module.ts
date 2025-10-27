import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditoriadocsoperadorController } from './auditoriadocsoperador.controller';
import { AuditoriadocsoperadorService } from './auditoriadocsoperador.service';
import { Auditoriadocsoperador, AuditoriadocsoperadorSchema } from './entities/auditoriadocsoperador.entity';
import { Resume, ResumeSchema } from '../resume/entities/resume.entity';
import { Documentoscargadosresume, DocumentoscargadosresumeSchema } from '../documentoscargadosresume/entities/documentoscargadosresume.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';

@Module({
  controllers: [AuditoriadocsoperadorController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Auditoriadocsoperador.name, schema: AuditoriadocsoperadorSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Documentoscargadosresume.name, schema: DocumentoscargadosresumeSchema },
      { name: Usuarios.name, schema: UsuariosSchema },
    ]),
  ],
  providers: [AuditoriadocsoperadorService],
  exports: [AuditoriadocsoperadorService],
})
export class AuditoriadocsoperadorModule {}


