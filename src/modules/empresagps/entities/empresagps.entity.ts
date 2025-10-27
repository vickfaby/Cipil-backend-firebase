import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Empresagps extends Document {
  @Prop()
  nombre_empresa: string;

  @Prop()
  direccion: string;

  @Prop()
  telefono: string;

  @Prop()
  pagina_acceso: string;
}

export const EmpresagpsSchema = SchemaFactory.createForClass(Empresagps);
