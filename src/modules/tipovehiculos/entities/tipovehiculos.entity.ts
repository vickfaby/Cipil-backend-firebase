import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tipovehiculos extends Document {
  @Prop({ required: true })
  nombre_tipovehiculo: string;
}

export const TipovehiculosSchema = SchemaFactory.createForClass(Tipovehiculos);
