import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Sexo extends Document {
  @Prop()
  nombre_sexo: string;
}

export const SexoSchema = SchemaFactory.createForClass(Sexo);
