import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Entidadesemisoras extends Document {
  @Prop()
  nombre_entidad: string;

  @Prop()
  telefono_entidad: number;

  @Prop()
  direccion_entidad: string;

  @Prop()
  ciudad_entidad: string;
}

export const EntidadesemisorasSchema =
  SchemaFactory.createForClass(Entidadesemisoras);
