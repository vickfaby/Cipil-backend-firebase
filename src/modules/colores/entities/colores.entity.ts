import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Colores extends Document {
  @Prop()
  nombre_color: string;

  @Prop()
  detalle_color: string;
}

export const ColoresSchema = SchemaFactory.createForClass(Colores);
