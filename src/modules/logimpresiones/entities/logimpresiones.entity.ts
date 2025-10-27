import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Resumevehiculo } from '../../resumevehiculo/entities/resumevehiculo.entity';
import { Resume } from '../../resume/entities/resume.entity';

@Schema({ timestamps: true })
export class Logimpresiones extends Document {
  @Prop()
  fecha_impresion: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: false,
    set: (v) => (v === '' ? null : v),
  })
  resume_id: Resume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumevehiculo',
    required: false,
    set: (v) => (v === '' ? null : v),
  })
  resumevehiculo_id: Resumevehiculo;
}

export const LogimpresionesSchema =
  SchemaFactory.createForClass(Logimpresiones);

LogimpresionesSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, ...logimpresiones } = this.toObject();
  return logimpresiones;
};
