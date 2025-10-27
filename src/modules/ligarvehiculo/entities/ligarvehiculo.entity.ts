import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Resumevehiculo } from 'src/modules/resumevehiculo/entities/resumevehiculo.entity';
import { EstadoInvitacion } from './estado-invitacion.enum';
import { TipoRelacion } from './tipo-relacion.enum';

@Schema({ timestamps: true })
export class LigarVehiculo extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  @ApiProperty({ type: String })
  usuario_a_ligar_id: Usuarios;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  @ApiProperty({ type: String })
  usuario_invitante_id: Usuarios;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumevehiculo',
    required: true,
  })
  @ApiProperty({ type: String })
  resume_vehiculo_id: Resumevehiculo;

  @Prop()
  @ApiProperty()
  correo_a_ligar: string;

  @Prop({
    type: String,
    enum: EstadoInvitacion,
    default: EstadoInvitacion.ENVIADA,
  })
  @ApiProperty({ enum: EstadoInvitacion })
  estado_invitacion: EstadoInvitacion;

  @Prop({
    type: String,
    enum: TipoRelacion,
    required: true,
  })
  @ApiProperty({ enum: TipoRelacion })
  tipo_relacion: TipoRelacion;

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

export const LigarVehiculoSchema = SchemaFactory.createForClass(LigarVehiculo);

LigarVehiculoSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, deleted, ...ligarVehiculo } = this.toObject();
  return ligarVehiculo;
};


