import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categorias, CategoriasSchema } from './entities/categorias.entity';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CategoriasController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Categorias.name,
        schema: CategoriasSchema,
      },
    ]),
  ],
  providers: [CategoriasService],
})
export class CategoriasModule {}
