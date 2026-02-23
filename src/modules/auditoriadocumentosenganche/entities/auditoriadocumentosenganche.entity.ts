import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Resume } from 'src/modules/resume/entities/resume.entity';
import { Documentoscargadosresume } from 'src/modules/documentoscargadosresume/entities/documentoscargadosresume.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { EstadoAuditoriaDocumentosEnganche } from './estado-auditoria-documentosenganche.enum';

@Schema({ timestamps: true })
export class Auditoriadocumentosenganche extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  })
  resume_id: Resume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documentoscargadosresume',
    required: true,
  })
  documento_cargado_id: Documentoscargadosresume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  auditor: Usuarios;

  @Prop({
    type: String,
    enum: EstadoAuditoriaDocumentosEnganche,
    default: EstadoAuditoriaDocumentosEnganche.NO_AUDITADO,
  })
  estado: EstadoAuditoriaDocumentosEnganche;

  @Prop()
  mensaje: string;

  @Prop({ default: false })
  verificado: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const AuditoriadocumentosengancheSchema = SchemaFactory.createForClass(Auditoriadocumentosenganche);

AuditoriadocumentosengancheSchema.methods.toJSON = function () {
  const { __v, deleted, ...doc } = this.toObject();
  return doc;
};

