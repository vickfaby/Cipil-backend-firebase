import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tipoterceros extends Document {
  @Prop({ required: true })
  nombre_tercero: string;
}

export const TipotercerosSchema = SchemaFactory.createForClass(Tipoterceros);
