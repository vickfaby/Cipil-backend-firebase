import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Clasesvehiculos extends Document {
  @Prop()
  nombre_clasevehiculo: string;

  @Prop()
  detalle_clasevehiculo: string;
}

export const ClasesvehiculosSchema =
  SchemaFactory.createForClass(Clasesvehiculos);
