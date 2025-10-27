import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Entidades extends Document {
  @Prop({ required: true })
  entidad: string;
}

export const EntidadesSchema = SchemaFactory.createForClass(Entidades);
