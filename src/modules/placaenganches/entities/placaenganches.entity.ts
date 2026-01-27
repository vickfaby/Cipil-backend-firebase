import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Tipocarrocerias } from '../../tipocarrocerias/entities/tipocarrocerias.entity';
import { Colores } from 'src/modules/colores/entities/colores.entity';
import { Marcaenganches } from 'src/modules/marcaenganches/entities/marcaenganches.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';

@Schema({ timestamps: true })
export class Placaenganches extends Document {
  @Prop()
  capacidad: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colores',
  })
  color_id: Colores;

  @Prop()
  configuracionvehicular: string;

  @Prop({ default: null })
  foto: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marcaenganches',
  })
  marca_id: Marcaenganches;

  @Prop()
  modelo: string;

  @Prop()
  numero_serie: string;

  @Prop()
  numero_plaqueta: string;

  @Prop()
  peso: number;

  @Prop()
  largo: number;

  @Prop()
  ancho: number;

  @Prop()
  alto: number;

  @Prop()
  s1: string;

  @Prop()
  s2: string;

  @Prop()
  s3: string;

  @Prop()
  s4: string;

  @Prop({ unique: true })
  placa: string;

  @Prop()
  propietario_id: string;

  @Prop()
  tenedor_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipocarrocerias',
  })
  tipocarroceria_id: Tipocarrocerias;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
  })
  user_id: Usuarios;
}

export const PlacaenganchesSchema =
  SchemaFactory.createForClass(Placaenganches);
