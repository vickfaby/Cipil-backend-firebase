import { Module } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { ColoresController } from './colores.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Colores, ColoresSchema } from './entities/colores.entity';

@Module({
  controllers: [ColoresController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Colores.name,
        schema: ColoresSchema,
      },
    ]),
  ],
  providers: [ColoresService],
  exports: [ColoresService],
})
export class ColoresModule {}
