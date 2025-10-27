import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tipocarrocerias extends Document {
  @Prop()
  nombre_tipocarroceria: string;

  @Prop()
  detalle_tipocarroceria: string;
}

export const TipocarroceriasSchema =
  SchemaFactory.createForClass(Tipocarrocerias);
