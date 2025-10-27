import { Module } from '@nestjs/common';
import { GrupoentidadesService } from './grupoentidades.service';
import { GrupoentidadesController } from './grupoentidades.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Grupoentidades,
  GrupoentidadesSchema,
} from './entities/grupoentidades.entity';

@Module({
  controllers: [GrupoentidadesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Grupoentidades.name,
        schema: GrupoentidadesSchema,
      },
    ]),
  ],
  providers: [GrupoentidadesService],
})
export class GrupoentidadesModule {}
