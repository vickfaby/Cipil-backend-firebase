import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Clasesvehiculos extends Document {
  @Prop()
  nombre_clasesvehiculos: string;

  @Prop()
  detalle_clasesvehiculos: string;
}

export const ClasesvehiculosSchema =
  SchemaFactory.createForClass(Clasesvehiculos);
