import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PosiciondisponibleService } from './posicion_disponible.service';
import { PosiciondisponibleController } from './posicion_disponible.controller';
import {
  Posiciondisponible,
  PosiciondisponibleSchema,
} from './entities/posicion_disponible.entity';
import { Resume, ResumeSchema } from '../resume/entities/resume.entity';
import {
  Resumevehiculo,
  ResumevehiculoSchema,
} from '../resumevehiculo/entities/resumevehiculo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posiciondisponible.name, schema: PosiciondisponibleSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Resumevehiculo.name, schema: ResumevehiculoSchema },
    ]),
  ],
  controllers: [PosiciondisponibleController],
  providers: [PosiciondisponibleService],
})
export class PosiciondisponibleModule {}

