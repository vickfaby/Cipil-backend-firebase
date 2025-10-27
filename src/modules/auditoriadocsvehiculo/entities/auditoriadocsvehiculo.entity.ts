import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Resumevehiculo } from 'src/modules/resumevehiculo/entities/resumevehiculo.entity';
import { Documentoscargadosvehiculo } from 'src/modules/documentoscargadosvehiculo/entities/documentoscargadosvehiculo.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { EstadoAuditoriaDocVehiculo } from './estado-auditoria-vehiculo.enum';

@Schema({ timestamps: true })
export class Auditoriadocsvehiculo extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumevehiculo',
    required: true,
  })
  resumevehiculo_id: Resumevehiculo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documentoscargadosvehiculo',
    required: true,
  })
  documento_cargado_id: Documentoscargadosvehiculo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  })
  auditor: Usuarios;

  @Prop({
    type: String,
    enum: EstadoAuditoriaDocVehiculo,
    default: EstadoAuditoriaDocVehiculo.NO_AUDITADO,
  })
  estado: EstadoAuditoriaDocVehiculo;

  @Prop()
  mensaje: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const AuditoriadocsvehiculoSchema = SchemaFactory.createForClass(Auditoriadocsvehiculo);

AuditoriadocsvehiculoSchema.methods.toJSON = function () {
  const { __v, deleted, ...doc } = this.toObject();
  return doc;
};



