import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Resumevehiculo } from 'src/modules/resumevehiculo/entities/resumevehiculo.entity';
import { EstadoInvitacion } from './estado-invitacion.enum';

@Schema({ timestamps: true })
export class InvitacionVehiculo extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  @ApiProperty()
  usuario_invitante_id: Usuarios;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumevehiculo',
    required: true,
  })
  @ApiProperty()
  resume_vehiculo_id: Resumevehiculo;

  @Prop({
    type: String,
    enum: EstadoInvitacion,
    default: EstadoInvitacion.ENVIADA,
  })
  @ApiProperty({ enum: EstadoInvitacion })
  estado_invitacion: EstadoInvitacion;

  @Prop()
  @ApiProperty()
  mensaje: string;

  @Prop()
  @ApiProperty()
  fecha_respuesta: Date;

  @Prop({ default: true })
  @ApiProperty()
  status: boolean;

  @Prop({ default: false })
  @ApiProperty()
  deleted: boolean;
}

export const InvitacionVehiculoSchema = SchemaFactory.createForClass(InvitacionVehiculo);

InvitacionVehiculoSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, deleted, ...invitacionVehiculo } = this.toObject();
  return invitacionVehiculo;
};


