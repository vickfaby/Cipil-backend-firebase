import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Marcasvehiculos extends Document {
  @Prop()
  nombre_marcavehiculo: string;
}

export const MarcasvehiculosSchema =
  SchemaFactory.createForClass(Marcasvehiculos);
