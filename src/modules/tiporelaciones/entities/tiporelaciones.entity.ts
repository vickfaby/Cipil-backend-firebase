import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tiporelaciones extends Document {
  @Prop({ required: true })
  nombre_tiporelacion: string;
}

export const TiporelacionesSchema =
  SchemaFactory.createForClass(Tiporelaciones);
