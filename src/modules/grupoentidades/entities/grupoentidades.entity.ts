import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Entidades } from '../../entidades/entities/entidades.entity';

@Schema({ timestamps: true })
export class Grupoentidades extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entidades',
  })
  entidad_id: Entidades;

  @Prop()
  nombre_entidad: string;
}

export const GrupoentidadesSchema =
  SchemaFactory.createForClass(Grupoentidades);
