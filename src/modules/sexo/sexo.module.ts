import { Module } from '@nestjs/common';
import { SexoService } from './sexo.service';
import { SexoController } from './sexo.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Sexo, SexoSchema } from './entities/sexo.entity';

@Module({
  controllers: [SexoController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Sexo.name,
        schema: SexoSchema,
      },
    ]),
  ],
  providers: [SexoService],
  exports: [SexoService],
})
export class SexoModule {}
