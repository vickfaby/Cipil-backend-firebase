import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tipopersona extends Document {
  @Prop()
  nombre_tipopersona: string;
}

export const TipopersonaSchema = SchemaFactory.createForClass(Tipopersona);
