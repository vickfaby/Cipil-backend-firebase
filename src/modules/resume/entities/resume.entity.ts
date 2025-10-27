import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import mongoose_paginate = require('mongoose-paginate-v2');

import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Categorias } from '../../categorias/entities/categorias.entity';
import { Documentoscargadosresume } from '../../documentoscargadosresume/entities/documentoscargadosresume.entity';
import { Referencias } from '../../referencias/entities/referencias.entity';
import { Seguridadsociales } from '../../seguridadsociales/entities/seguridadsociales.entity';
import { Tipoterceros } from '../../tipoterceros/entities/tipoterceros.entity';
import { Tipodocumentos } from 'src/modules/tipodocumentos/entities/tipodocumentos.entity';
import { Tipopersona } from 'src/modules/tipopersona/entities/tipopersona.entity';
import { Sexo } from 'src/modules/sexo/entities/sexo.entity';

@Schema({ timestamps: true })
export class Resume extends Document {
  @Prop({ default: null })
  foto: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipodocumentos',
  })
  tipodocumento: Tipodocumentos;

  @Prop({ required: true, unique: true, index: true })
  numerodocumento: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorias',
  })
  categoria_id: Categorias;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipoterceros',
  })
  tipotercero_id: Tipoterceros;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipopersona',
  })
  tipopersona: Tipopersona;

  @Prop()
  razonsocial: string;

  @Prop()
  nombre: string;

  @Prop()
  apellido: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sexo',
  })
  sexo: Sexo;

  @Prop()
  telefono: number;

  @Prop()
  direccion: string;

  @Prop()
  pais: number;

  @Prop()
  estado: number;

  @Prop()
  ciudad: number;

  @Prop()
  ubicacion: string;

  @Prop()
  fecha_nacimiento: string;

  @Prop()
  calificacion: string;

  @Prop()
  progreso: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seguridadsociales',
    },
  ])
  entidades_seguridad_social: Seguridadsociales[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Referencias',
    },
  ])
  referencias: Referencias[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Documentoscargadosresume',
    },
  ])
  documentos: Documentoscargadosresume[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
  })
  user_id: Usuarios;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: false,
  })
  usuario_operador_id: Usuarios;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: false,
  })
  usuario_empresa_id: Usuarios;

  @Prop()
  status: boolean;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

ResumeSchema.plugin(mongoose_paginate);

ResumeSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, ...resume } = this.toObject();
  return resume;
};
