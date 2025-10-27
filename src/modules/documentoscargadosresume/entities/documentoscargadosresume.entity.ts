import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Documentos } from 'src/modules/documentos/entities/documentos.entity';
import { Entidadesemisoras } from 'src/modules/entidadesemisoras/entities/entidadesemisoras.entity';
import { Grupodocumentos } from 'src/modules/grupodocumentos/entities/grupodocumentos.entity';
import { Resume } from '../../resume/entities/resume.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';

@Schema({ timestamps: true })
export class Documentoscargadosresume extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupodocumentos',
  })
  grupodocumento_id: Grupodocumentos;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documentos',
  })
  documento_id: Documentos;

  @Prop()
  fecha_expedicion: string;

  @Prop()
  fecha_vencimiento: string;

  @Prop()
  nombre: string;

  @Prop()
  categoria: string;

  @Prop()
  codigo_referencia: string;

  @Prop()
  observaciones: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entidadesemisoras',
  })
  entidad_emisora: Entidadesemisoras;

  @Prop()
  documento: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  })
  resume_id: Resume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
  })
  user_id: Usuarios;

  @Prop({ default: 0 })
  estado_documento: number;
}

export const DocumentoscargadosresumeSchema = SchemaFactory.createForClass(
  Documentoscargadosresume,
);
