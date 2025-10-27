import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tipodocumentos extends Document {
  @Prop()
  nombre_tipodocumento: string;

  @Prop()
  detalle_tipodocumento: string;
}

export const TipodocumentosSchema =
  SchemaFactory.createForClass(Tipodocumentos);
