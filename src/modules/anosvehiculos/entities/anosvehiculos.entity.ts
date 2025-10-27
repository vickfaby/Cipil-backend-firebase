import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Marcasvehiculos } from '../../marcasvehiculos/entities/marcasvehiculos.entity';

@Schema({ timestamps: true })
export class Anosvehiculos extends Document {
  @Prop({ required: true })
  ano: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marcasvehiculos',
  })
  marcavehiculo_id: Marcasvehiculos;
}

export const AnosvehiculosSchema = SchemaFactory.createForClass(Anosvehiculos);
