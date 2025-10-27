import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Anosvehiculos } from 'src/modules/anosvehiculos/entities/anosvehiculos.entity';
import { Marcasvehiculos } from '../../marcasvehiculos/entities/marcasvehiculos.entity';

@Schema({ timestamps: true })
export class Modelosvehiculos extends Document {
  @Prop()
  nombre_modelovehiculo: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anosvehiculos',
  })
  marca_vehiculo_ano_id: Anosvehiculos;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marcasvehiculos',
  })
  marca_vehiculo_id: Marcasvehiculos;
}

export const ModelosvehiculosSchema =
  SchemaFactory.createForClass(Modelosvehiculos);
