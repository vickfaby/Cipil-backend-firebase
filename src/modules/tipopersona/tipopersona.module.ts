import { Module } from '@nestjs/common';
import { TipopersonaService } from './tipopersona.service';
import { TipopersonaController } from './tipopersona.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Tipopersona, TipopersonaSchema } from './entities/tipopersona.entity';

@Module({
  controllers: [TipopersonaController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tipopersona.name,
        schema: TipopersonaSchema,
      },
    ]),
  ],
  providers: [TipopersonaService],
  exports: [TipopersonaService],
})
export class TipopersonaModule {}
