import { Module } from '@nestjs/common';
import { ReferenciasService } from './referencias.service';
import { ReferenciasController } from './referencias.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Referencias, ReferenciasSchema } from './entities/referencias.entity';
import {
  Auditoriareferencias,
  AuditoriareferenciasSchema,
} from '../auditoriareferencias/entities/auditoriareferencias.entity';
import { CitiesModule } from '../cities/cities.module';
import { CountriesModule } from '../countries/countries.module';
import { StatesModule } from '../states/states.module';

@Module({
  controllers: [ReferenciasController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Referencias.name,
        schema: ReferenciasSchema,
      },
      {
        name: Auditoriareferencias.name,
        schema: AuditoriareferenciasSchema,
      },
    ]),
    CountriesModule,
    StatesModule,
    CitiesModule,
  ],
  providers: [ReferenciasService],
  exports: [ReferenciasService],
})
export class ReferenciasModule {}
