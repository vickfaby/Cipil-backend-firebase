import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Resume } from 'src/modules/resume/entities/resume.entity';
import { EstadoInvitacion } from './estado-invitacion.enum';

@Schema({ timestamps: true })
export class Invitaciones extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  @ApiProperty()
  usuario_invitante_id: Usuarios;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  })
  @ApiProperty()
  resume_operador_id: Resume;

  @Prop({ 
    type: String,
    enum: EstadoInvitacion,
    default: EstadoInvitacion.ENVIADA 
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

export const InvitacionesSchema = SchemaFactory.createForClass(Invitaciones);

InvitacionesSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, deleted, ...invitacion } = this.toObject();
  return invitacion;
};
