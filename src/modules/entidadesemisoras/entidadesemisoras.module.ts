import { Module } from '@nestjs/common';
import { EntidadesemisorasService } from './entidadesemisoras.service';
import { EntidadesemisorasController } from './entidadesemisoras.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Entidadesemisoras,
  EntidadesemisorasSchema,
} from './entities/entidadesemisoras.entity';

@Module({
  controllers: [EntidadesemisorasController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Entidadesemisoras.name,
        schema: EntidadesemisorasSchema,
      },
    ]),
  ],
  providers: [EntidadesemisorasService],
})
export class EntidadesemisorasModule {}
