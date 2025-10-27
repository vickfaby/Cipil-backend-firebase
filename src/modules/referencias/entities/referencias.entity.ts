import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Tiporelaciones } from '../../tiporelaciones/entities/tiporelaciones.entity';
import { Resume } from '../../resume/entities/resume.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';

@Schema({ timestamps: true })
export class Referencias extends Document {
  @Prop()
  nombre_completo: string;

  @Prop()
  telefonos: number;

  @Prop()
  pais_referencia: number;

  @Prop()
  estado_referencia: number;

  @Prop()
  ciudad_referencia: number;

  @Prop()
  direccion: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tiporelaciones',
  })
  relacion: Tiporelaciones;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  })
  resume_id: Resume;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
  })
  user_id: Usuarios;

  @Prop()
  status: boolean;
}

export const ReferenciasSchema = SchemaFactory.createForClass(Referencias);
