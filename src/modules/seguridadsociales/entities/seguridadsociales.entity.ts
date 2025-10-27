import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Entidades } from '../../entidades/entities/entidades.entity';
import { Grupoentidades } from '../../grupoentidades/entities/grupoentidades.entity';
import { Resume } from '../../resume/entities/resume.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';

@Schema({ timestamps: true })
export class Seguridadsociales extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entidades',
  })
  tipoentidad_id: Entidades;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupoentidades',
  })
  grupoentidad_id: Grupoentidades;

  @Prop()
  fecha_afiliacion: string;

  @Prop({ default: 0 })
  estado_afiliacion: number;

  @Prop()
  observaciones: string;

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

  @Prop({ default: false })
  status: boolean;
}

export const SeguridadsocialesSchema =
  SchemaFactory.createForClass(Seguridadsociales);
