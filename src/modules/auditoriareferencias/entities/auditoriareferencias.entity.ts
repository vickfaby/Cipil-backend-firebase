import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Resume } from 'src/modules/resume/entities/resume.entity';
import { Referencias } from 'src/modules/referencias/entities/referencias.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { EstadoAuditoriaReferencia } from './estado-auditoria-referencia.enum';

@Schema({ timestamps: true })
export class Auditoriareferencias extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  })
  resume_id: Resume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referencias',
    required: true,
  })
  referencia_id: Referencias;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  auditor: Usuarios;

  @Prop({
    type: String,
    enum: EstadoAuditoriaReferencia,
    default: EstadoAuditoriaReferencia.NO_AUDITADO,
  })
  estado: EstadoAuditoriaReferencia;

  @Prop()
  mensaje: string;

  @Prop({ default: false })
  verificado: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const AuditoriareferenciasSchema = SchemaFactory.createForClass(Auditoriareferencias);

AuditoriareferenciasSchema.methods.toJSON = function () {
  const { __v, deleted, ...doc } = this.toObject();
  return doc;
};

