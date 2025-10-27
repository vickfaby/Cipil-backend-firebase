import { Module } from '@nestjs/common';
import { TipotercerosService } from './tipoterceros.service';
import { TipotercerosController } from './tipoterceros.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tipoterceros,
  TipotercerosSchema,
} from './entities/tipoterceros.entity';

@Module({
  controllers: [TipotercerosController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tipoterceros.name,
        schema: TipotercerosSchema,
      },
    ]),
  ],
  providers: [TipotercerosService],
})
export class TipotercerosModule {}
