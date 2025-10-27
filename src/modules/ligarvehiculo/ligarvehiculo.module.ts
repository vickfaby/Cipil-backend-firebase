import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LigarvehiculoService } from './ligarvehiculo.service';
import { LigarvehiculoController, LigarvehiculoResumeController } from './ligarvehiculo.controller';
import { LigarVehiculo, LigarVehiculoSchema } from './entities/ligarvehiculo.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';
import { ResumevehiculoModule } from '../resumevehiculo/resumevehiculo.module';
import { PaginationV2Middleware } from 'src/common/middleware/pagination-v2.middleware';

@Module({
  controllers: [LigarvehiculoController, LigarvehiculoResumeController],
  imports: [
    ConfigModule,
    ResumevehiculoModule,
    MongooseModule.forFeature([
      { name: LigarVehiculo.name, schema: LigarVehiculoSchema },
      { name: Usuarios.name, schema: UsuariosSchema },
    ]),
  ],
  providers: [LigarvehiculoService],
  exports: [LigarvehiculoService],
})
export class LigarvehiculoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationV2Middleware).forRoutes(LigarvehiculoResumeController);
  }
}


