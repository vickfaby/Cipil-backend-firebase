import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitacionvehiculoService } from './invitacionvehiculo.service';
import { InvitacionvehiculoController, InvitacionvehiculoResumeController } from './invitacionvehiculo.controller';
import { InvitacionVehiculo, InvitacionVehiculoSchema } from './entities/invitacionvehiculo.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';
import { ResumevehiculoModule } from '../resumevehiculo/resumevehiculo.module';
import { PaginationV2Middleware } from 'src/common/middleware/pagination-v2.middleware';

@Module({
  controllers: [InvitacionvehiculoController, InvitacionvehiculoResumeController],
  imports: [
    ConfigModule,
    ResumevehiculoModule,
    MongooseModule.forFeature([
      { name: InvitacionVehiculo.name, schema: InvitacionVehiculoSchema },
      { name: Usuarios.name, schema: UsuariosSchema },
    ]),
  ],
  providers: [InvitacionvehiculoService],
  exports: [InvitacionvehiculoService],
})
export class InvitacionvehiculoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationV2Middleware).forRoutes(InvitacionvehiculoResumeController);
  }
}


