import { MiddlewareConsumer, Module } from '@nestjs/common';
import { InvitacionesService } from './invitaciones.service';
import { InvitacionesController, InvitacionesResumeController } from './invitaciones.controller';
import { PaginationV2Middleware } from 'src/common/middleware/pagination-v2.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitaciones, InvitacionesSchema } from './entities/invitaciones.entity';
import { Usuarios, UsuariosSchema } from '../usuarios/entities/usuarios.entity';
import { Resume, ResumeSchema } from '../resume/entities/resume.entity';
import { InvitacionVehiculo, InvitacionVehiculoSchema } from '../invitacionvehiculo/entities/invitacionvehiculo.entity';
import { LigarVehiculo, LigarVehiculoSchema } from '../ligarvehiculo/entities/ligarvehiculo.entity';
import { Resumevehiculo, ResumevehiculoSchema } from '../resumevehiculo/entities/resumevehiculo.entity';

@Module({
  controllers: [InvitacionesController, InvitacionesResumeController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Invitaciones.name,
        schema: InvitacionesSchema,
      },
      {
        name: Usuarios.name,
        schema: UsuariosSchema,
      },
      {
        name: Resume.name,
        schema: ResumeSchema,
      },
      {
        name: InvitacionVehiculo.name,
        schema: InvitacionVehiculoSchema,
      },
      {
        name: LigarVehiculo.name,
        schema: LigarVehiculoSchema,
      },
      {
        name: Resumevehiculo.name,
        schema: ResumevehiculoSchema,
      },
    ]),
  ],
  providers: [InvitacionesService],
  exports: [InvitacionesService],
})
export class InvitacionesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationV2Middleware).forRoutes(InvitacionesResumeController);
  }
}
