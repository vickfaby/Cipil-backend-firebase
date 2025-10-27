import { Module } from '@nestjs/common';
import { EntidadesService } from './entidades.service';
import { EntidadesController } from './entidades.controller';
import { Entidades, EntidadesSchema } from './entities/entidades.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [EntidadesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Entidades.name,
        schema: EntidadesSchema,
      },
    ]),
  ],
  providers: [EntidadesService],
})
export class EntidadesModule {}
