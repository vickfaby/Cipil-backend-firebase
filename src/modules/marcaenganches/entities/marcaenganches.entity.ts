import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Marcaenganches extends Document {
  @Prop()
  marcaEnganche: string;

  @Prop()
  modeloEnganche: number;

  @Prop()
  numEjesEnganche: number;

  @Prop()
  numChasisEnganche: number;

  @Prop()
  largoTotalEnganche: number;

  @Prop()
  anchoTotalEnganche: number;

  @Prop()
  altoTotalEnganche: number;

  @Prop()
  pesoTotalEnganche: number;

  @Prop()
  detalleEnganche: string;
}

export const MarcaenganchesSchema =
  SchemaFactory.createForClass(Marcaenganches);
