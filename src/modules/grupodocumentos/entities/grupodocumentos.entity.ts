import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Grupodocumentos extends Document {
  @Prop()
  nombre_grupodocumento: string;
}

export const GrupodocumentosSchema =
  SchemaFactory.createForClass(Grupodocumentos);
