import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditoriareferenciasController } from './auditoriareferencias.controller';
import { AuditoriareferenciasService } from './auditoriareferencias.service';
import { Auditoriareferencias, AuditoriareferenciasSchema } from './entities/auditoriareferencias.entity';
import { Resume, ResumeSchema } from '../resume/entities/resume.entity';
import { Referencias, ReferenciasSchema } from '../referencias/entities/referencias.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';

@Module({
  controllers: [AuditoriareferenciasController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Auditoriareferencias.name, schema: AuditoriareferenciasSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Referencias.name, schema: ReferenciasSchema },
      { name: Usuarios.name, schema: UsuariosSchema },
    ]),
  ],
  providers: [AuditoriareferenciasService],
  exports: [AuditoriareferenciasService],
})
export class AuditoriareferenciasModule {}

