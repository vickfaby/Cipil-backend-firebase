import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Categorias extends Document {
  @Prop({ required: true })
  nombre_categoria: string;
}

export const CategoriasSchema = SchemaFactory.createForClass(Categorias);
