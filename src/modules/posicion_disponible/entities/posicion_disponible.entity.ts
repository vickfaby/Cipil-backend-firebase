import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Resume } from '../../resume/entities/resume.entity';
import { Resumevehiculo } from '../../resumevehiculo/entities/resumevehiculo.entity';

@Schema({ timestamps: true })
export class Posiciondisponible extends Document {
  @Prop()
  direccion: string;

  @Prop()
  latitud: number;

  @Prop()
  longitud: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: false,
  })
  resume_id: Resume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumevehiculo',
    required: false,
  })
  resumevehiculo_id: Resumevehiculo;

  @Prop({ default: Date.now })
  fecha_creacion: Date;
}

export const PosiciondisponibleSchema =
  SchemaFactory.createForClass(Posiciondisponible);

